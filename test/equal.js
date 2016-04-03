'use strict';

var ndarray = require('ndarray');
var ops = require('ndarray-ops');
var pool = require('ndarray-scratch');
var blas1 = require('ndarray-blas-level1');
var show = require('ndarray-show');
var chai = require('chai');
var assert = chai.assert;

var approximatelyEqual = require('../lib/approximately-equal')

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
    assert.isFalse( approximatelyEqual(a,b) );
  });

  it('false if shapes unequal',function() {
    assert.isFalse( approximatelyEqual(b,c) );
  });

  it('false if values unequal',function() {
    assert.isFalse( approximatelyEqual(c,d) );
  });

  it('true if within tolerance',function() {
    assert.isTrue( approximatelyEqual(d,e, 1e-4) );
  });

  it('false if not within tolerance',function() {
    assert.isFalse( approximatelyEqual(e,f, 1e-8) );
  });

  it('true if exactly equal',function() {
    assert.isTrue( approximatelyEqual(d,f) );
  });

  it('false if any entry is NaN',function() {
    assert.isFalse( approximatelyEqual(f,g) );
    assert.isFalse( approximatelyEqual(g,f) );
  });

  //it('aliased to equal',function() {
    //assert.isFalse(equal(f,g) );
  //});

});

