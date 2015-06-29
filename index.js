'use strict';

var ops = require('ndarray-ops'),
    pool = require('ndarray-scratch'),
    blas1 = require('ndarray-blas-level1')
    //show = require('ndarray-show');

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


var equal = function(a,b, tol, onFalse) {
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
  ops.abseq(diff);
  var nrm = ops.sup(diff);

  if( nrm > Math.max(0,tol) ) {
    output(onFalse, 'approximatelyEqual():: max element of A - B (= ' + nrm + ') > ' + tol);
    return false;
  }

  var sum = ops.sum(diff);

  if( isNaN(sum) ) {
    output(onFalse, 'approximatelyEqual():: matrix contains NaN');
    return false;
  }

  return true;
};


var matrixIsSymmetric = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'matrixIsSymmetric():: can only test for symmetry of two-dimensional arrays');
    return false;
  }

  if( a.shape[0] !== a.shape[1] ) {
    output(onFalse,'matrixIsSymmetric():: matrix is non-square');
    return false;
  }

  for(var i=0; i<a.shape[0]; i++) {
    for(var j=0; j<i; j++) {
      if( Math.abs(a.get(i,j) - a.get(j,i)) > tol ) {
        output(onFalse,'matrixIsSymmetric():: a[' + i + ',' + j + '] (= ' + a.get(i,j) + ') not within ' + tol + ' of a[' + j + ',' + i + '] (= ' + a.get(j,i) + ')');
        return false;
      }
    }
  }

  return true;
};


var matrixColsAreOrthogonal = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'matrixColsAreOrthogonal():: can only test for orthogonality of two-dimensional arrays');
    return false;
  }

  for(var i=0; i<a.shape[1]; i++) {
    for(var j=i+1; j<a.shape[1]; j++) {
      var nrm = blas1.dot( a.pick(null,i), a.pick(null,j) );
      if( nrm > tol ) {
        output(onFalse,'matrixColsAreOrthogonal():: dot(a[:,' + i + '], a[:,' + j + ']) (= ' + nrm + ') > ' + tol);
        return false;
      }
    }
  }

  return true;
};

var matrixColsAreNormalized = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'matrixColsAreNormalized():: can only test for column normality of two-dimensional arrays');
    return false;
  }

  for(var i=0; i<a.shape[1]; i++) {
    var nrm = ops.norm2( a.pick(null,i) );
    if( Math.abs(nrm - 1) > tol ) {
      output(onFalse,'matrixColsAreNormalized():: norm2(a[:,' + i + ']) (' + nrm + ') > 1 +/- ' + tol);
      return false;
    }
  }
  return true;
};


var vectorsAreOrthogonal = function(a, b, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 1 || b.dimension !== 1 ) {
    output(onFalse,'vectorsAreOrthogonal():: can only test for orthogonality of one-dimensional arrays');
    return false;
  }

  var nrm = blas1.dot(a,b);

  if( nrm > Math.max(0,tol) ) {
    output(onFalse,'vectorsAreOrthogonal():: inner product of a, b (= ' + nrm + ') > ' + tol + '.');
    return false;
  }

  return true;
};

var vectorIsNormalized = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 1 ) {
    output(onFalse,'vectorIsNormalized():: can only test for normality of one-dimensional arrays');
    return false;
  }

  var nrm = blas1.nrm2(a,a);

  if( Math.abs(nrm - 1) > Math.max(0,tol) ) {
    output(onFalse,'vectorIsNormalized():: L-2 norm of A (= ' + nrm + ') > 1 +/- ' + tol + '.');
    return false;
  }

  return true;
};

var vectorsAreOrthonormal = function(a, b, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( ! vectorIsNormalized(a,tol) ) {
    output(onFalse,'vectorsAreOrthonormal():: first vector is not normal');
    return false;
  }

  if( ! vectorIsNormalized(b,tol) ) {
    output(onFalse,'vectorsAreOrthonormal():: second vector is not normal');
    return false;
  }

  if( ! vectorsAreOrthogonal(a,b,tol) ) {
    output(onFalse,'vectorsAreOrthonormal():: vectors not orthogonal');
    return false;
  }

  return true;
};

var matrixIsOrthogonal = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'matrixIsOrthogonal():: can only test for column normality of two-dimensional arrays');
    return false;
  }

  if( ! matrixColsAreOrthogonal(a,tol) ) {
    output(onFalse,'matrixIsOrthogonal():: columns not orthogonal');
    return false;
  }

  if( ! matrixColsAreNormalized(a,tol) ) {
    output(onFalse,'matrixIsOrthogonal():: columns not normal');
    return false;
  }

  // These tests don't hurt anything but I'll have to stop and think about whether they're
  // necessary or whether a matrix with orthonormal columns also necessarily has orthonormal
  // rows.
  if( ! matrixColsAreOrthogonal(a.transpose(1,0),tol) ) {
    output(onFalse,'matrixIsOrthogonal():: rows not orthogonal');
    return false;
  }

  if( ! matrixColsAreNormalized(a.transpose(1,0),tol) ) {
    output(onFalse,'matrixIsOrthogonal():: rows not normal');
    return false;
  }

  return true;
};

var matrixIsUpperTriangular = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'matrixIsUpperTriangular():: can only test for triangularity of two-dimensional arrays');
    return false;
  }

  for(var i=1; i<a.shape[0]; i++) {
    for(var j=0; j<i; j++) {
      if( Math.abs(a.get(i,j)) > tol ) {
        output(onFalse,'matrixIsUpperTriangular():: A[' + i + ',' + j + '] (= ' + a.get(i,j) + ') > ' + tol + '.');
        return false;
      }
    }
  }

  return true;
};

var matrixIsLowerTriangular = function(a, tol, onFalse) {
  if( tol === undefined ) {
    tol = 0.0;
  }

  if( a.dimension !== 2 ) {
    output(onFalse,'matrixIsLowerTriangular():: can only test for triangularity of two-dimensional arrays');
    return false;
  }

  for(var i=0; i<a.shape[0]; i++) {
    for(var j=i+1; j<a.shape[1]; j++) {
      if( Math.abs(a.get(i,j)) > tol ) {
        output(onFalse,'matrixIsLowerTriangular():: A[' + i + ',' + j + '] (= ' + a.get(i,j) + ') > ' + tol + '.');
        return false;
      }
    }
  }

  return true;
};


// Deprecation warnings:

var symmetric = function(a,tol,onFalse) {
  console.warn('Warning: symmetric() is deprecated. Please use matrixIsSymmetric() instead');
  matrixIsSymmetric(a,tol,onFalse);
};

var orthogonal = function orthogonal(a, tol, onFalse) {
  console.warn('Warning: orthogonal() is deprecated. Please use matrixIsOrthogonal() instead');
  return matrixIsOrthogonal(a,tol,onFalse);
};

var matrixOrthogonal  = function matrixOrthogonal (a, tol, onFalse) {
  console.warn('Warning: matrixOrthogonal () is deprecated. Please use matrixIsOrthogonal() instead');
  return matrixIsOrthogonal(a,tol,onFalse);
};

var columnsOrthogonal = function columnsOrthogonal(a, tol, onFalse) {
  console.warn('Warning: columnsOrthogonal() is deprecated. Please use matrixColsAreOrthogonal() instead');
  return matrixColsAreOrthogonal(a,tol,onFalse);
};

var matrixColsNormalized = function matrixColsNormalized(a, tol, onFalse) {
  console.warn('Warning: matrixColsNormalized() is deprecated. Please use matrixColsAreNormalized() instead');
  return matrixColsAreNormalized(a,tol,onFalse);
};

var upperTriangular = function upperTriangular(a, tol, onFalse) {
  console.warn('Warning: upperTriangular() is deprecated. Please use matrixIsUpperTriangular() instead');
  return matrixIsUpperTriangular(a,tol,onFalse);
};

var lowerTriangular = function lowerTriangular(a, tol, onFalse) {
  console.warn('Warning: lowerTriangular() is deprecated. Please use matrixIsLowerTriangular() instead');
  return matrixIsLowerTriangular(a,tol,onFalse);
};



exports.approximatelyEqual = equal;
exports.equal = equal;

exports.matrixIsSymmetric = matrixIsSymmetric;
exports.matrixColsAreOrthogonal = matrixColsAreOrthogonal;
exports.matrixColsAreNormalized = matrixColsAreNormalized;
exports.matrixIsOrthogonal = matrixIsOrthogonal;
exports.matrixIsUpperTriangular = matrixIsUpperTriangular;
exports.matrixIsLowerTriangular = matrixIsLowerTriangular;

exports.vectorsAreOrthogonal = vectorsAreOrthogonal;
exports.vectorIsNormalized = vectorIsNormalized;
exports.vectorsAreOrthonormal = vectorsAreOrthonormal;

//exports.diagonal = diagonal;

// Deprecated functions:
exports.columnsOrthogonal = columnsOrthogonal;
exports.symmetric = symmetric;
exports.orthogonal = orthogonal;
exports.matrixColsNormalized = matrixColsNormalized;
exports.matrixOrthogonal = matrixOrthogonal;
exports.upperTriangular = upperTriangular;
exports.lowerTriangular = lowerTriangular;


