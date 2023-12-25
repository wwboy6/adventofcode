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

function pathToHash(label0, label1) {
  const [l0, l1] = [label0, label1].sort()
  return `${l0}-${l1}`
}

function bfs(connections, fromLabel, toLabel) {
  const bfsDis = {}
  let lls = [
    {
      value: fromLabel,
      parent: null,
      len: 1
    }
  ]
  while(lls.length) {
    const ll = lls.shift()
    const toLabels = connections[ll.value]
    if (toLabels.includes(toLabel)) {
      const tll = lib.llAdd(ll, toLabel)
      return tll
    }
    for (let label of toLabels) {
      const result = lib.llFind(ll, label)
      if (!!result) continue
      if (bfsDis[label] && bfsDis[label] <= ll.len + 1) continue
      bfsDis[label] = ll.len + 1
      lls.push(lib.llAdd(ll, label))
    }
  }
}

function addStat(stats, hash, value) {
  if (!stats[hash]) {
    stats[hash] = value
  } else {
    stats[hash] += value
  }
}

function searchNarrowLinks(connections, narrowCount) {
  const stat = {}
  let count = 0
  for (let i0 = 0; i0 < labels.length - 1; ++i0) {
    for (let i1 = i0 + 1; i1 < labels.length; ++i1) {
      ++count
      // debugLog('search path', labels[i0], labels[i1])
      let ll = bfs(connections, labels[i0], labels[i1])
      // stats all path in ll
      while (ll.parent) {
        addStat(stat, pathToHash(ll.value, ll.parent.value), 1)
        ll = ll.parent
      }
      // debugLog1(labels[i0], labels[i1], JSON.stringify(stat))
      // TODO:
      if (count % 10000 === 0) {
        debugLog('search path', labels[i0], labels[i1])
        const entries = Object.entries(stat).sort((e0, e1) => e1[1] - e0[1]).slice(0, 10)
        debugLog(JSON.stringify(entries))
      }
    }
  }
  // sort stat
  const entries = Object.entries(stat).sort((e0, e1) => e1[1] - e0[1]).slice(0, 3)
  const sortedLabels = entries.map(e => e[0])
  debugLog({sortedLabels})
  return sortedLabels
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

  // const lines = fs.readFileSync(process.stdin.fd).toString().replace('\r', '').split("\n");

  // debugLog(JSON.stringify(connections, null, 2))

  // search all sortest path combination and stat them
  const result = searchNarrowLinks(connections, 3)
  debugLog(result)

  // last loggings of my run:
  // [["gqr-vbk",195793],["klj-scr",189353],["mxv-sdv",168797],["klj-tpv",72437],["klj-ntd",72092],["hcg-sdv",70921],["hdn-sdv",66702],["gkf-vbk",66594],["hbq-scr",58176],["gqr-hls",55952]]
  // { sortedLabels: [ 'gqr-vbk', 'klj-scr', 'mxv-sdv' ] }

  console.log('====')
  // console.log({sum})

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
