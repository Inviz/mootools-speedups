/*
---

name: Class.Extras

description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

license: MIT-style license.

requires: Class

extends: Core/Class.Extras
...
*/

//dont use typeOf in loop :)

(function(apply) {
  
  Options.prototype.setOptions = function(){
  	var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
  	if (this.addEvent) for (var option in options){
  	  var value = options[option];
  		if (!value || (value.apply != apply) || !(/^on[A-Z]/).test(option)) continue;
  		this.addEvent(option, options[option]);
  		delete options[option];
  	}
  	return this;
  }

})(Function.prototype.apply);