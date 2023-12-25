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

function v2IsSame (v0, v1) {
  return v0.x === v1.x && v0.y === v1.y
}

function v2ToHash (v) { return `${v.x},${v.y}`}

function rv3Minus (v0, v1) {
  return [v0[0] - v1[0], v0[1] - v1[1], v0[2] - v1[2]]
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

function llFind(llHead, targetValue, comparator) {
  while (llHead) {
    if (
      (!comparator && targetValue === llHead.value) ||
      (comparator && comparator(llHead.value, targetValue))
    ) return llHead
    llHead = llHead.parent
  }
  return null
}

function llAdd(llHead, value) {
  return {
    value,
    parent: llHead,
    len: llHead ? llHead.len + 1 : 1 
  }
}

module.exports = {
  compareObject,
  rFact,
  v2Add,
  v2IsSame,
  v2ToHash,
  rv3Minus,
  getMap,
  setMap,
  mapToHash,
  llFind,
  llAdd,
}
