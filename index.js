'use strict';

var ops = require('ndarray-ops'),
    pool = require('ndarray-scratch'),
    show = require('ndarray-show'),
    blas1 = require('ndarray-blas-level1');

function output(callback,message,method,reason) {
  //console.log(message);
  if( callback !== undefined && typeof callback === 'function' ) {
    callback(message,method,reason);
  }
};


function arraysEqual (a,b) {
  var i;
  var la = a.length;
  var lb = b.length;
  if(la!==lb) return false;
  for(i=0; i<a.length; i++) {
    if( a[i] !== b[i] ) {
      return false;
    }
  }
  return true;
};


var approximatelyEqual = function(a,b, tol, onFalse) {
  var t;

  if( tol === undefined ) {
    tol = 0;
  }

  if( a.dimension !== b.dimension ) { 
    output(onFalse,'approximatelyEqual():: a.dimension (= ' + a.dimension + ') !=   b.dimension (= ' + b.dimension + ')');
    return false;
  }

  if( ! arraysEqual(a.shape,b.shape) ) {
    output(onFalse, 'approximatelyEqual():: a.shape != b.shape');
    return false;
  }

  var diff = pool.zeros(a.shape, 'float64');
  ops.sub(diff, a, b);
  var nrm = ops.norm2(diff);

  if( nrm > Math.abs(tol) ) {
    output(onFalse, 'approximatelyEqual():: 2-norm ||a - b|| (= ' + nrm + ') > ' + tol);
    return false;
  }

  return true;
};


var symmetric = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'symmetric():: can only test for symmetry of two-dimensional arrays');
    return false;
  }

  if( a.shape[0] !== a.shape[1] ) {
    output(onFalse,'symmetric():: matrix is non-square');
    return false;
  }

  for(var i=0; i<a.shape[0]; i++) {
    for(var j=0; j<i; j++) {
      if( Math.abs(a.get(i,j) - a.get(j,i)) > tol ) {
        output(onFalse,'symmetric():: a[' + i + ',' + j + '] (= ' + a.get(i,j) + ') not within ' + tol + ' of a[' + j + ',' + i + '] (= ' + a.get(j,i) + ')');
        return false;
      }
    }
  }

  return true;
};

var columnsOrthogonal = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'columnsOrthogonal():: can only test for orthogonality of two-dimensional arrays');
    return false;
  }

  for(var i=0; i<a.shape[1]; i++) {
    for(var j=i+1; j<a.shape[1]; j++) {
      var nrm = blas1.dot( a.pick(null,i), a.pick(null,j) );
      if( nrm > tol ) {
        output(onFalse,'columnsOrthogonal():: dot(a[:,' + i + '], a[:,' + j + ']) (= ' + nrm + ') > ' + tol);
        return false;
      }
    }
  }

  return true;
};

var columnsNormalized = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'columnsNormalized():: can only test for column normality of two-dimensional arrays');
    return false;
  }

  for(var i=0; i<a.shape[1]; i++) {
    var nrm = ops.norm2( a.pick(null,i) );
    if( Math.abs(nrm - 1) > tol ) {
      output(onFalse,'columnsNormalized():: norm2(a[:,' + i + ']) (' + nrm + ') > ');
      return false;
    }
  }
  return true;
};


var orthogonal = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'columnsNormalized():: can only test for column normality of two-dimensional arrays');
    return false;
  }

  if( ! columnsOrthogonal(a,tol) ) {
    output(onFalse,'orthogonal():: columns not orthogonal');
    return false;
  }

  if( ! columnsNormalized(a,tol) ) {
    output(onFalse,'orthogonal():: columns not normal');
    return false;
  }

  // These tests don't hurt anything but I'll have to stop and think about whether they're
  // necessary or whether a matrix with orthonormal columns also necessarily has orthonormal
  // rows.
  if( ! columnsOrthogonal(a.transpose(1,0),tol) ) {
    output(onFalse,'orthogonal():: rows not orthogonal');
    return false;
  }

  if( ! columnsNormalized(a.transpose(1,0),tol) ) {
    output(onFalse,'orthogonal():: rows not normal');
    return false;
  }

  return true;
};



exports.approximatelyEqual = approximatelyEqual;
exports.symmetric = symmetric;
exports.columnsOrthogonal = columnsOrthogonal;
exports.columnsNormalized = columnsNormalized;
exports.orthogonal = orthogonal;
//exports.upperTriangular = upperTriangular;
//exports.lowerTriangular = lowerTriangular;
//exports.diagonal = diagonal;
