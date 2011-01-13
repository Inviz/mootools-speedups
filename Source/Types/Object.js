/*
---
 
script: Base.js
 
description: Speedy function that checks equality of objects (doing some nasty type assumption)
 
license: Public domain (http://unlicense.org).

authors: Yaroslaff Fedin

extends: Core/Object

*/



Object.equals = function(one, another) {
  if (one == another) return true;
  if ((!one) ^ (!another)) return false;
  if (typeof one == 'undefined') return false;
  
  if ((one instanceof Array) || one.callee) {
    var j = one.length;
    if (j != another.length) return false;
    for (var i = 0; i < j; i++) if (!Object.equals(one[i], another[i])) return false;
    return true;
  } else if (one instanceof Color) {
    return (one.red == another.red) && (one.green == another.green) && (one.blue == another.blue) && (one.alpha == another.alpha)
  } else if (typeof one == 'object') {
    if (one.equals) return one.equals(another)
    for (var i in one) if (!Object.equals(one[i], another[i])) return false;
    return true;
  }
  return false;
};