'use strict';

var arraysEqual = require('./arrays-equal');
var ops = require('ndarray-ops');
var pool = require('ndarray-scratch');

module.exports = approximatelyEqual;

function approximatelyEqual (a,b, tol, messages) {
  var t;
	var getsMessages = Array.isArray(messages);

  if( tol === undefined ) {
    tol = 0;
  }

  if( a.dimension !== b.dimension ) {
		if (getsMessages) {
			messages.push('approximatelyEqual: a.dimension (= ' + a.dimension + ') !=   b.dimension (= ' + b.dimension + ')');
		}
    return false;
  }

  if (! arraysEqual(a.shape,b.shape)) {
		if (getsMessages) {
			messages.push('approximatelyEqual: a.shape != b.shape');
		}
    return false;
  }

  var diff = pool.zeros(a.shape, 'float64');
  ops.sub(diff, a, b);
  ops.abseq(diff);
  var nrm = ops.sup(diff);

  if( nrm > Math.max(0,tol) ) {
		if (getsMessages) {
			messages.push('approximatelyEqual: max element of A - B (= ' + nrm + ') > ' + tol);
		}
    return false;
  }

  var sum = ops.sum(diff);

  if( isNaN(sum) ) {
		if (getsMessages) {
			messages.push('approximatelyEqual: matrix contains NaN');
		}
    return false;
  }

  return true;
};


