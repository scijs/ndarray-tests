'use strict';

var ndarray = require('ndarray'),
    ndtest = require('../index'),
    chai = require("chai"),
    sinon = require('sinon'),
    show = require('ndarray-show');

var assert = chai.assert;

describe('onFalse callbacks',function() {
  var a,b,c;

  beforeEach(function() {
    a = ndarray([1,2,3,4],[4]);
    b = ndarray([1,2,3,4],[4]);
    c = ndarray([1,2,3,4],[2,2]);
  });

  it('does not call onFalse if the test is true',function() {
    var callback = sinon.spy();
    ndtest.approximatelyEqual(a,b, 1e-4, callback);
    assert(callback.notCalled);
  });

  it('calls onFalse if the test is false',function() {
    var callback = sinon.spy();
    ndtest.approximatelyEqual(a,c, 1e-4, callback);
    assert(callback.called);
  });

});

describe('approximatelyEqual',function() {

  var a,b,c,d,e,f,g;

  beforeEach(function() {
    a = ndarray([1,2,3,4,5,6],[6]);
    b = ndarray([3,4,5,6,5,6],[2,3]);

    c = ndarray([1,2,3,4,5,7],[3,2]);
    d = ndarray([1,2,3,4,5,6],[3,2]);
    e = ndarray([1,2,3,4,5,6.00001],[3,2]);
    f = ndarray([1,2,3,4,5,6],[3,2]);
    g = ndarray([1,2,NaN,4,5,6],[3,2]);
  });

  it('false if dimensions unequal',function() {
    assert.isFalse( ndtest.approximatelyEqual(a,b) );
  });

  it('false if shapes unequal',function() {
    assert.isFalse( ndtest.approximatelyEqual(b,c) );
  });

  it('false if values unequal',function() {
    assert.isFalse( ndtest.approximatelyEqual(c,d) );
  });

  it('true if within tolerance',function() {
    assert.isTrue( ndtest.approximatelyEqual(d,e, 1e-4) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( ndtest.approximatelyEqual(e,f, 1e-8) );
  });

  it('true if exactly equal',function() {
    assert.isTrue( ndtest.approximatelyEqual(d,f) );
  });

  it('false if any entry is NaN',function() {
    assert.isFalse( ndtest.approximatelyEqual(f,g) );
  });

  it('aliased to equal',function() {
    assert.isFalse( ndtest.equal(f,g) );
  });

});


describe('matrixIsSymmetric',function() {

  var wrongdim,wrongshape,symmetric,almostsymmetric;

  beforeEach(function() {
    wrongdim = ndarray([1,2,3,4,5,7],[6]);
    wrongshape = ndarray([1,2,3,4,5,6],[3,2]);
    symmetric = ndarray([1,2,3,2,4,5,3,5,6],[3,3]);
    almostsymmetric = ndarray([1,2,3,2,4,5,3,5.01,6],[3,3]);
  });

  it('false if not two-dimensional',function() {
    assert.isFalse( ndtest.matrixIsSymmetric(wrongdim) );
  });

  it('false if non-square',function() {
    assert.isFalse( ndtest.matrixIsSymmetric(wrongshape) );
  });

  it('no tolerance provided and exactly symmetric',function() {
    assert.isTrue( ndtest.matrixIsSymmetric(symmetric) );
  });

  it('no tolerance provided and not exactly symmetric',function() {
    assert.isFalse( ndtest.matrixIsSymmetric(almostsymmetric) );
  });

  it('not within tolerance',function() {
    assert.isFalse( ndtest.matrixIsSymmetric(almostsymmetric, 1e-4) );
  });

  it('true if values within tolerance',function() {
    assert.isTrue( ndtest.matrixIsSymmetric(almostsymmetric, 1e-1) );
  });

});


describe('matrixColsAreOrthogonal',function() {

  var orthogonal, almostOrthogonal;

  beforeEach(function() {
    orthogonal       = ndarray([0, 0,   2,  1,0,0,  0,1,0,  0,0,0],[4,3]);
    almostOrthogonal = ndarray([0, 0.01,1,  1,0,0,  0,1,0,  0,0,0],[4,3]);
  });

  it('false if no tolerance provided and not exactly orthogonal',function() {
    assert.isFalse( ndtest.matrixColsAreOrthogonal(almostOrthogonal) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( ndtest.matrixColsAreOrthogonal(almostOrthogonal, 1e-4) );
  });

  it('true if no tolerance provided and exactly orthogonal',function() {
    assert.isTrue( ndtest.matrixColsAreOrthogonal(orthogonal) );
  });

  it('true if within tolerance',function() {
    assert.isTrue( ndtest.matrixColsAreOrthogonal(almostOrthogonal, 1e-1) );
  });

});


describe('matrixColsAreNormalized',function() {

  var normal, nonNormal;

  beforeEach(function() {
    var r2 = Math.sqrt(2) * 0.5;
    normal       = ndarray([r2 + 1e-8, -r2, 0, 0, -r2, r2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],[4,4]);
    nonNormal    = ndarray([r2, -r2, 1, 0, -r2, r2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],[4,4]);
  });

  it('true if within tolerance',function() {
    assert.isTrue( ndtest.matrixColsAreNormalized(normal, 1e-4) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( ndtest.matrixColsAreNormalized(normal, 1e-12) );
  });

  it('false if not normalized',function() {
    assert.isFalse( ndtest.matrixColsAreNormalized(nonNormal, 1e-4) );
  });

});


describe('vectorsAreOrthogonal',function() {

  var a,b,c;

  beforeEach(function() {
    a = ndarray([1,   1,0],[3]);
    b = ndarray([0,1e-4,1],[3]);
    c = ndarray([0,   0,1],[3]);
  });

  it('true if orthogonal',function() {
    assert.isTrue( ndtest.vectorsAreOrthogonal(a,c) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( ndtest.vectorsAreOrthogonal(a,b, 1e-8) );
  });

  it('true if within tolerance',function() {
    assert.isTrue( ndtest.vectorsAreOrthogonal(a,b, 1e-2) );
  });

});

describe('vectorIsNormalized',function() {

  var b,c;

  beforeEach(function() {
    b = ndarray([0,1e-1,1],[3]);
    c = ndarray([0,   0,1],[3]);
  });

  it('true if normal',function() {
    assert.isTrue( ndtest.vectorIsNormalized(c) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( ndtest.vectorIsNormalized(b, 1e-8) );
  });

  it('true if within tolerance',function() {
    assert.isTrue( ndtest.vectorIsNormalized(b, 1e-2) );
  });

});

describe('vectorsAreOrthonormal',function() {

  var a,b,c,d;

  beforeEach(function() {
    a = ndarray([1,   0,0],[3]);
    b = ndarray([0,1e-3,1],[3]);
    c = ndarray([0,   0,1],[3]);
    d = ndarray([0,   1,0],[3]);
  });

  it('true if orthonormal',function() {
    assert.isTrue( ndtest.vectorsAreOrthonormal(c,d) );
  });

  it('false if not within normality tolerance',function() {
    assert.isFalse( ndtest.vectorsAreOrthonormal(a,b, 1e-8) );
  });

  it('true if within tolerance',function() {
    assert.isTrue( ndtest.vectorsAreOrthonormal(a,b, 1e-2) );
  });

});

describe('matrixIsOrthogonal',function() {

  var orthonormal, nonOrthonormal;

  beforeEach(function() {
    var r2 = Math.sqrt(2) * 0.5;
    orthonormal    = ndarray([r2, -r2, 0, 0, -r2, r2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],[4,4]);
    nonOrthonormal = ndarray([r2, -r2, 1e-4, 0, -r2, r2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],[4,4]);
  });

  it('true if orthogonal and normal ( = orthonormal)',function() {
    assert.isTrue( ndtest.matrixIsOrthogonal(orthonormal, 1e-8) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( ndtest.matrixIsOrthogonal(nonOrthonormal, 1e-8) );
  });

});



describe('matrixIsUpperTriangular',function() {

  var upperTall, almostUpperTall, upperWide, almostUpperWide;

  beforeEach(function() {
    upperTall       = ndarray([1,2,3,0,4,5,0,0,6,0,0,0],[4,3]);
    almostUpperTall = ndarray([1,2,3,1e-4,4,5,0,0,6,0,0,0],[4,3]);
    upperWide       = ndarray([1,2,3,4,0,5,6,7,0,0,8,9],[3,4]);
    almostUpperWide = ndarray([1,2,3,4,1e-4,5,6,7,0,0,8,9],[3,4]);
  });

  describe('tall matrices',function() {
    it('true if exactly upper triangular',function() {
      assert.isTrue( ndtest.matrixIsUpperTriangular(upperTall) );
    });

    it('true if within tolerance',function() {
      assert.isTrue( ndtest.matrixIsUpperTriangular(almostUpperTall,1e-2) );
    });

    it('false if no tolerance provided and not exactly upper triangular',function() {
      assert.isFalse( ndtest.matrixIsUpperTriangular(almostUpperTall) );
    });

    it('false if not within tolerance',function() {
      assert.isFalse( ndtest.matrixIsUpperTriangular(almostUpperTall,1e-8) );
    });
  });

  describe('wide matrices',function() {
    it('true if exactly upper triangular',function() {
      assert.isTrue( ndtest.matrixIsUpperTriangular(upperWide) );
    });

    it('true if within tolerance',function() {
      assert.isTrue( ndtest.matrixIsUpperTriangular(almostUpperWide,1e-2) );
    });

    it('false if no tolerance provided and not exactly upper triangular',function() {
      assert.isFalse( ndtest.matrixIsUpperTriangular(almostUpperWide) );
    });

    it('false if not within tolerance',function() {
      assert.isFalse( ndtest.matrixIsUpperTriangular(almostUpperWide,1e-8) );
    });
  });

});



describe('matrixIsLowerTriangular',function() {

  var lowerTall, almostLowerTall, lowerWide, almostLowerWide;

  beforeEach(function() {
    lowerTall       = ndarray([1,0,0,1,1,0,1,1,1,1,1,1],[4,3]);
    almostLowerTall = ndarray([1,1e-4,0,1,1,0,1,1,1,1,1,1],[4,3]);
    lowerWide       = ndarray([1,0,0,0,2,3,0,0,4,5,6,0,7,8,9,10],[3,4]);
    almostLowerWide = ndarray([1,1e-4,0,0,2,3,0,0,4,5,6,0,7,8,9,10],[3,4]);
  });

  describe('tall matrices',function() {
    it('true if exactly lower triangular',function() {
      assert.isTrue( ndtest.matrixIsLowerTriangular(lowerTall) );
    });

    it('true if within tolerance',function() {
      assert.isTrue( ndtest.matrixIsLowerTriangular(almostLowerTall,1e-2) );
    });

    it('false if no tolerance provided and not exactly lower triangular',function() {
      assert.isFalse( ndtest.matrixIsLowerTriangular(almostLowerTall) );
    });

    it('false if not within tolerance',function() {
      assert.isFalse( ndtest.matrixIsLowerTriangular(almostLowerTall,1e-8) );
    });
  });

  describe('wide matrices',function() {
    it('true if exactly lower triangular',function() {
      assert.isTrue( ndtest.matrixIsLowerTriangular(lowerWide) );
    });

    it('true if within tolerance',function() {
      assert.isTrue( ndtest.matrixIsLowerTriangular(almostLowerWide,1e-2) );
    });

    it('false if no tolerance provided and not exactly lower triangular',function() {
      assert.isFalse( ndtest.matrixIsLowerTriangular(almostLowerWide) );
    });

    it('false if not within tolerance',function() {
      assert.isFalse( ndtest.matrixIsLowerTriangular(almostLowerWide,1e-8) );
    });
  });


});


