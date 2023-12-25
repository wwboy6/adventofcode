const assert = require('assert')
const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, false, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function searchGroup(connections, fromLabel) {
  const group = new Set()
  group.add(fromLabel)
  const queue = [ fromLabel ]
  while (queue.length) {
    const label = queue.shift()
    for (let l of connections[label]) {
      if (group.has(l)) continue
      group.add(l)
      queue.push(l)
    }
  }
  return group
}

let labels

async function main () {
  const filePath = path.resolve(__dirname, inputFilePath)

  // const file = fs.createReadStream(filePath)
  // const rl = readline.createInterface({
  //   input: file,
  //   crlfDelay: Infinity,
  // })
  // for await (const line of rl) {
  // }

  const dataStr = await fs.promises.readFile(filePath, 'utf8')
  const lines = dataStr.replace('\r', '').split('\n')

  let connections = lines.reduce((cons, line) => {
    const [_, fromLabel, toStr] = line.match(/(\w+)?: +(.*)/)
    const toLabels = toStr.split(' ')
    if (!cons[fromLabel]) cons[fromLabel] = []
    for (let toLabel of toLabels) {
      if (!cons[toLabel]) cons[toLabel] = []
      cons[fromLabel].push(toLabel)
      cons[toLabel].push(fromLabel)
    }
    return cons
  }, {})
  
  labels = Object.keys(connections)

  // remove 3 connections
  let rmConns = [
    ['gqr', 'vbk'],
    ['klj', 'scr'],
    ['mxv', 'sdv'],
  ]
  for (let conn of rmConns) {
    connections[conn[0]] = connections[conn[0]].filter(l => l !== conn[1])
    connections[conn[1]] = connections[conn[1]].filter(l => l !== conn[0])
  }
  // console.log(JSON.stringify(connections))

  const group = searchGroup(connections, labels[0])
  console.log(group.size)

  console.log('====')
  console.log(group.size * (labels.length - group.size))

}


// ===========================

const outputFileName = `${path.basename (__filename).split('.')[0]}.txt`

function debugLog(...args) {
  _debugLog(0, ...args)
}

function debugLog1(...args) {
  _debugLog(1, ...args)
}

function debugLog2(...args) {
  _debugLog(2, ...args)
}

function _debugLog(flagI, ...args) {
  if (muteFlags[flagI]) return
  console.log.apply(null, args)
}

let outputFile
async function recordOutput(args, output) {
  if (!outputFile) outputFile = await fs.promises.open(path.resolve(__dirname, outputFileName), 'w')
  await outputFile.appendFile(`${JSON.stringify({ args, output })}\n`)
}

// ===========================

main();

module.exports = {
  coreFunction,
}
