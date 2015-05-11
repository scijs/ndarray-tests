# ndarray-tests

Test numerical properties of ndarrays

[![Build Status](https://travis-ci.org/scijs/ndarray-tests.svg)](https://travis-ci.org/scijs/ndarray-tests) [![npm version](https://badge.fury.io/js/ndarray-tests.svg)](http://badge.fury.io/js/ndarray-tests) [![Dependency Status](https://david-dm.org/scijs/ndarray-tests.svg)](https://david-dm.org/scijs/ndarray-tests)

## Intro

I very quickly got sick of testing matrix equality by hand over and over. This package implements methods for testing near-equality and other properties of ndarrays. Its goal is to be a set of test helpers so that it's not necessary to hard-code numbers. Decompositions aren't always unique (e.g. orthogonal columns may be chosen arbitrarily in some cases as long as they're orthogonal), so it's probably better to test properties than numbers.

Note that some obvious tests are ommitted because they're one-liners.

Please feel free to make any suggestions/contributions for how to more clearly and consistently define specific property tests.

## Usage

Require the library and use the methods described below. The onFalse callback is optional and serves only to simplify passing data while allowing the function to return a boolean. Tolerances are always assumed to be zero (exact equality) unless otherwise specified.

```javascript
var ndtest = require('ndarray-tests');

ndtest.orthogonal(A,B,1e-4); // returns boolean


// Returns boolean and if it fails, passes explanation to callback
ndtest.orthogonal(A,B,1e-4,function(message) {
  console.log(message);
});

```

### Methods:

##### same dimensions:
Keep it simple and just ask, e.g.: `assert( a.dimension === b.dimension )`

##### same shape:
Keep it simple and just ask, e.g.: `assert.deepEqual( a.shape, b.shape )`

================

##### `approximatelyEqual( a, b [, tol] [, onFalse] )`
Test whether the maximum element-wise difference between `a` and `b` (the L-infinity norm of `(a - b)`) is less than the tolerance. Works on arrays of any dimension.

================

#### Vector tests:

##### `vectorIsNormalized( a [, tol], [, onFalse] )`
Test whether the L-2 norm of `a` is within `tol` of unity. 

##### `vectorsAreOrthogonal( a, b, [, tol], [, onFalse] )`
Test whether the inner product of vectors a and `b` is within `tol` of zero. 

##### `vectorsAreOrthonormal( a, b, [, tol], [, onFalse] )`
Test whether vectors `a` and `b` are both normalized and orthogonal using `vectorIsNormalized` and `vectorsAreOrthogonal`.


================

#### Matrix tests:

##### `matrixIsSymmetric( a [, tol], [, onFalse] )`
Test for element-wise symmetry. Returns false if the difference between any element and its counterpart is greater than the tolerance.

##### `matrixColumnsAreNormalized( a [, tol], [, onFalse] )`
Test whether the L2 norm of every column is within `tol` of 1.

##### `matrixColumnsAreOrthogonal( a [, tol], [, onFalse] )`
Test whether the pairwise inner product of all column pairs is less than `tol`.

##### `matrixIsOrthogonal( a [, tol], [, onFalse] )`
Checks for squareness, column normality, and pair-wise column orthogonality to check if the matrix is orthogonal. `tol` is passed to the `matrixColumnsAreNormal` and `matrixColumnsAreOrthogonal`

##### `matrixIsUpperTriangular( a, [, tol] [, onFalse] )`
Check whether all entries below the diagonal are within `tol` of zero. Works on tall and wide two-dimensional ndarrays.

##### `matrixIsLowerTriangular( a, [, tol] [, onFalse] )`
Check whether all entries above the diagonal are within `tol` of zero. Works on tall and wide two-dimensional ndarrays.




### TO DO:

- `diagonal( a, [, tol] [, onFalse] )`
- separate column methods to allow testing of specific pair-wise columns (or maybe that's simple enough that it's unnecessary)



## Credits
(c) 2015 Ricky Reusser. MIT License
