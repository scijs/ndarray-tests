# ndarray-tests

Test numerical properties of ndarrays

## Intro

This package implements methods for testing near-equality and other properties of ndarrays. Its goal is to be a set of test helpers so that it's not necessary to hard-code numbers. Decompositions aren't always unique (e.g. orthogonal columns may be chosen arbitrarily in some cases as long as they're orthogonal), so it's perhaps better to test properties than numbers..

Note that some obvious tests are ommitted because they're one-liners.

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

#### same dimensions:
Keep it simple and just ask, e.g.: `assert( a.dimension === b.dimension )`

#### same shape:
Keep it simple and just ask, e.g.: `assert.deepEqual( a.shape, b.shape )`


#### `approximatelyEqual( a, b [, tol] [, onFalse] )`
Test whether L2 norm of the difference between `a` and `b` is less than the tolerance. For higher dimensional arrays, it effectively unrolls everything and treats it as if it were a vector.

#### `symmetric( a [, tol], [, onFalse] )`
Test for element-wise symmetry. Returns false if the difference between any element and its counterpart is greater than the tolerance.

#### `columnsNormal( a [, tol], [, onFalse] )`
Test whether the L2 norm of every column is within `tol` of 1.

#### `columnsOrthogonal( a [, tol], [, onFalse] )`
Test whether the pairwise inner product of all column pairs is less than `tol`.

#### `orthogonal( a [, tol], [, onFalse] )`
Checks for squareness, column normality, and pair-wise column orthogonality to check if the matrix is orthogonal. `tol` is passed to the `columnsNormal` and `columnsOrthogonal`


### TO DO:

- `upperTriangular( a, b, [, tol] [, onFalse] )`
- `lowerTriangular( a, b, [, tol] [, onFalse] )`
- `diagonal( a, [, tol] [, onFalse] )`
- separate column methods to allow testing of specific pair-wise columns (or maybe that's simple enough that it's unnecessary)



## Credits
(c) 2015 Ricky Reusser. MIT License
