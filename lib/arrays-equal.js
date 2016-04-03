'use strict';

module.exports = arraysEqual;

function arraysEqual (a,b) {
  var i;
  var la = a.length;
  var lb = b.length;
  if (la!==lb) {
		return false;
	}
  for (i=0; i<a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

