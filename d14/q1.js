const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { rFact, compareObject } = require('../lib/lib');

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, false, false, ]

function weigth(data) {
  const lineCount = data.length
  let sum = 0;
  for (let y = 0; y < data.length; ++y) {
    const lineWeight = lineCount - y
    sum += data[y].filter(c => c === 'O').length * lineWeight
  }
  return sum
}

function slide(data) {
  // TODO: transform data for dir

  const width = data[0].length
  for (let y = 1; y < data.length; ++y) {
    for (let x = 0; x < width; ++x) {
      if (data[y][x] !== 'O') continue;
      // search for upper space
      let resultY = y
      for (let ty = y - 1; ty >= 0; --ty) {
        if (data[ty][x] !== '.') break
        resultY = ty
      }
      // roll
      data[y][x] = '.'
      data[resultY][x] = 'O'
    }
  }

  // TODO: anti transform data for dir
}

async function coreFunction(data) {
  slide(data)
  const result = data;

  await recordOutput([data], result)
  return result
}

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, inputFilePath))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let data = []
  for await (const line of rl) {
    data.push(line.split(''))
  }

  coreFunction(data)

  // debugLog({data})
  // debugLog(data.map(line => line.join('')).join('\n'));

  let result = weigth(data)

  console.log('====')
  // console.log({sum})
  console.log({result})

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
