const assert = require('assert')
const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, true, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function pathToHash(label0, label1) {
  const [l0, l1] = [label0, label1].sort()
  return `${l0}-${l1}`
}

function statsPaths(connections, fromLabel, toLabel, labelHistories = new Set(), level = 0) {
  assert(fromLabel !== toLabel)
  if (labelHistories.size === 0) labelHistories.add(fromLabel)
  let pathCount = 0
  const stats = {}
  for (let ll of connections[fromLabel]) {
    if (labelHistories.has(ll)) continue
    let hash = pathToHash(fromLabel, ll)
    //
    if (ll === toLabel) {
      ++pathCount
      if (!stats[hash]) {
        stats[hash] = 1
      } else {
        stats[hash] += 1
      }
      continue
    }
    //
    const newHistories = new Set(labelHistories)
    newHistories.add(ll)
    const {pathCount: newPathCount, stats: newStats} = statsPaths(connections, ll, toLabel, newHistories, level + 1)
    // add stat from fromLabel to ll w.r.t. newPathCount and merge them
    if (newPathCount) {
      pathCount += newPathCount
      if (!stats[hash]) {
        stats[hash] = newPathCount
      } else {
        stats[hash] += newPathCount
      }
      for (hash in newStats) {
        if (!stats[hash]) {
          stats[hash] = newStats[hash]
        } else {
          stats[hash] += newStats[hash]
        }
      }
      // TODO:
      if (level <= 3) {
        let entries = Object.entries(stats).sort((e0, e1) => e1[1] - e0[1]).slice(0, 5)
        debugLog(fromLabel, JSON.stringify(entries))
      }
    }
  }
  return { pathCount, stats }
}

function checkWeakLinks(connections, label0, label1, narrowCount) {
  // loop all paths from label0 to label1 and stats all path count
  const { pathCount, stats } = statsPaths(connections, label0, label1)
  debugLog1(JSON.stringify(stats, null, 2))
  // find 3 paths that add up to path count
  const entries = Object.entries(stats)
  const narrowPaths = entries.sort((e0, e1) => e1[1] - e0[1]).slice(0, narrowCount)
  // debugLog1(JSON.stringify(narrowPaths, null, 2))
  const narrowSum = narrowPaths.reduce((s, c) => s + c[1], 0)
  debugLog1({narrowSum, pathCount})
  if (narrowSum >= pathCount) return narrowPaths.map(e => e[0])
}

let labels

function searchWeekLinks(connections, narrowCount) {
  for (let i0 = 0; i0 < labels.length - 1; ++i0) {
    for (let i1 = i0 + 1; i1 < labels.length; ++i1) {
      debugLog('check weak links', labels[i0], labels[i1])
      const result = checkWeakLinks(connections, labels[i0], labels[i1], narrowCount)
      if (result) {
        return result
      }
    }
  }

}

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

  // for each combination, check if "narrow links" exist
  const result = searchWeekLinks(connections, 3)
  debugLog(result)
  

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
