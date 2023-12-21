const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')
const { sign } = require('crypto')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, true, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function modulesToHash(modules) {
  return JSON.stringify(modules)
}

// const processModuleCache = {}

function outputOfConj (module) {
  return Object.values(module.inIsLow).reduce((o, i) => o && !i, true)
}

function pushSignal(signals, fromSignal, receiver, output, checks) {
  if (!output && Object.keys(checks).includes(fromSignal.to)) {
    checks[fromSignal.to] = true
  }
  signals.push(
    {
      from: fromSignal.to,
      isLow: output,
      to: receiver,
    }
  )
}

function processModule(modules) {
  modules = _.cloneDeep(modules)
  const hash = modulesToHash(modules)
  let checks = {
    // rx: false,
    jf: false,
    qs: false,
    zk: false,
    ks: false,
  }
  // // if (processModuleCache[hash]) return _.cloneDeep(processModuleCache[hash])
  let count = [0, 0]
  let signals = [
    {
      from: 'button',
      isLow: true,
      to: 'broadcaster',
    }
  ]
  while (signals.length) {
    const signal = signals.shift()
    debugLog1(`${signal.from} ${signal.isLow ? '-low' : '-high'}-> ${signal.to}`)
    ++count[signal.isLow ? 0 : 1]
    const module = modules[signal.to]
    if (!module) continue
    let output
    switch(module.moduleType) {
      case '%': // Switch
        if (signal.isLow) {
          // flip
          module.isLow = !module.isLow
          // send msg
          for (let receiver of module.receivers) {
            pushSignal(signals, signal, receiver, module.isLow, checks)
          }
        }
        break
      case '&': // Conjunction
        module.inIsLow[signal.from] = signal.isLow
        output = outputOfConj(module)
        for (let receiver of module.receivers) {
          pushSignal(signals, signal, receiver, output, checks)
        }
        break
      default: // start
        for (let receiver of module.receivers) {
          pushSignal(signals, signal, receiver, signal.isLow, checks)
        }
        break
    }
  }
  debugLog1({ count })
  // debugLog1("======")
  // processModuleCache[hash] = { count: [...count], modules, hasRx }
  return { count, modules, checks }
}

let targetModuleAnalyze = {
  ks: { checks: [ {i: 0} ] },
  jf: { checks: [ {i: 0} ] },
  qs: { checks: [ {i: 0} ] },
  zk: { checks: [ {i: 0} ] },
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
  const lines = dataStr.split("\n");

  // const line = fs.readFileSync(process.stdin.fd).toString().split("\n");

  let modules = Object.fromEntries(lines.map(line => {
    let [, moduleType, label, receiverStr] = line.match(/([%&]*)(\w+?) -> (.*)/)
    const receivers = receiverStr.split(', ')
    return [label, { label, moduleType, receivers } ]
  }))

  // initialize 
  for (let label of Object.keys(modules)) {
    const module = modules[label]
    if (module.moduleType !== '&') {
      // switch
      module.isLow = true
    }
    // conjunctions
    // find all input
    const inputModules = Object.values(modules).filter(m => m.receivers.includes(label))
    module.inIsLow = Object.fromEntries(inputModules.map(m => [m.label, true]))
  }

  // debugLog({modules})
  // debugLog(JSON.stringify(modules, null, 2))

  // let totalCount = [0, 0]
  let i = 0
  while (true) {
    ++i
    // debugLog({i, cache: Object.keys(processModuleCache).length })
    if (i % 1000 === 0) debugLog({i})
    result = processModule(modules)
    if (result.hasRx) break
    modules = result.modules
    
    // analyze specific modules
    for (let label of Object.keys(targetModuleAnalyze)) {
      // const module = modules[label]
      // // monitor when it output false
      // if (!outputOfConj(module)) {
      //   targetModuleAnalyze[label].checks.push(i)
      // }
      if (result.checks[label]) {
        const checks = targetModuleAnalyze[label].checks
        const diff = i - checks[checks.length - 1].i
        checks.push({
          i,
          diff,
        })
      }
    }
    debugLog(JSON.stringify(targetModuleAnalyze, null, 2))
  }

  console.log('====')
  // console.log({totalCount})
  // console.log(totalCount[0] * totalCount[1])
  console.log({i})
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
