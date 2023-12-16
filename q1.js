const fs = require('fs')
const readline = require('readline')
const path = require('path')
const { rFact, compareObject } = require('../lib/lib')

const inputFilePath = 'input-test.txt'
// const inputFilePath = 'input.txt'
const muteFlags = [true, true, true, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, inputFilePath))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {

  }

  // debugLog('hi')

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