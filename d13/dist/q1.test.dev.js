"use strict";

var _vitest = require("vitest");

var _require = require('../lib/lib'),
    rFact = _require.rFact;

_vitest.test.each([{
  b: 2,
  expected: 2
}, {
  b: 3,
  expected: 6
}, {
  b: 4,
  expected: 3
}])('rFact($b) -> $expected', function (_ref) {
  var b = _ref.b,
      expected = _ref.expected;
  (0, _vitest.expect)(rFact(b)).toBe(expected);
});