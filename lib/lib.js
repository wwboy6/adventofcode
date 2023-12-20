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

function v2Add (v0, v1) {
  return { x: v0.x + v1.x, y: v0.y + v1.y }
}

function getMap(map, pos) {
  const row = map[pos.y]
  if (!row) return
  return row[pos.x]
}

function setMap(map, pos, value) {
  map[pos.y][pos.x] = value
}

function mapToHash(map) {
  return map.map(line => line.join('')).join('\n')
}

module.exports = {
  compareObject,
  rFact,
  v2Add,
  getMap,
  setMap,
  mapToHash,
}
