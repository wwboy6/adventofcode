const { memoize } = require('lodash')

function compareObject(arr0, arr1) {
  return JSON.stringify(arr0) === JSON.stringify(arr1)
}

const rFact = memoize(
  function (num) {
    if (num === 0)
      { return 1; }
    else
      { return num * rFact( num - 1 ); }
  }
)

module.exports = {
  compareObject,
  rFact,
}
