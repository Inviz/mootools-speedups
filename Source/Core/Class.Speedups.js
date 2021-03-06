/*
---

name: Class

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

extends: Core/Class


...
*/

(function(){

var Class = this.Class = new Type('Class', function(params){
  if (instanceOf(params, Function)) params = {initialize: params};

  var newClass = function(){
    reset(this);
    if (newClass.$prototyping) return this;
    this.$caller = null;
    var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
    this.$caller = this.caller = null;
    return value;
  }.extend(this).implement(params);

  newClass.$constructor = Class;
  newClass.prototype.$constructor = newClass;
  newClass.prototype.parent = parent;

  return newClass;
});

var parent = function(){
  if (!this.$caller) throw new Error('The method "parent" cannot be called.');
  var name = this.$caller.$name,
    parent = this.$caller.$owner.parent,
    previous = (parent) ? parent.prototype[name] : null;
  if (!previous) throw new Error('The method "' + name + '" has no parent.');
  return previous.apply(this, arguments);
};


var arrayish = Array.prototype.slice;
var regexpish = RegExp.prototype.exec;
//Speedup1: Avoid typeOf in reset

// before: 
// switch (typeOf(value)){
//  case 'object':
//  case 'array':

// after:
var F = function(){};
var reset = function(object){
  for (var key in object){
    var value = object[key];
    if (value && typeof(value) == 'object' && value.exec != regexpish) {
      var family = value.$family && value.$family();
      if (family === 'array' || value.slice == arrayish) {
        object[key] = value.clone();
      } else if (!family || family == 'object'){
        F.prototype = value; 
        object[key] = reset(new F);
      }
    }
  }
  return object;
};

var wrap = function(self, key, method){
  if (method.$origin) method = method.$origin;
  var wrapper = function(){
    if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
    var caller = this.caller, current = this.$caller;
    this.caller = current; this.$caller = wrapper;
    var result = method.apply(this, arguments);
    this.$caller = current; this.caller = caller;
    return result;
  }.extend({$owner: self, $origin: method, $name: key});
  return wrapper;
};

//Speedup 2: Avoid typeOf in implement
var apply = Function.prototype.apply
var implement = function(key, value, retain){
  if (Class.Mutators.hasOwnProperty(key)){
    value = Class.Mutators[key].call(this, value);
    if (value == null) return this;
  }

  if (value && value.call && (value.apply == apply)){
    if (value.$hidden) return this;
    this.prototype[key] = (retain) ? value : wrap(this, key, value);
  } else {
    Object.merge(this.prototype, key, value);
  }

  return this;
};

var getInstance = function(klass){
  klass.$prototyping = true;
  var proto = new klass;
  delete klass.$prototyping;
  return proto;
};

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

  Extends: function(parent){
    this.parent = parent;
    this.prototype = getInstance(parent);
  },

  Implements: function(items){
    Array.from(items).each(function(item){
      var instance = new item;
      for (var key in instance) implement.call(this, key, instance[key], true);
    }, this);
  }
};

})();
