const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { rFact, compareObject } = require('../lib/lib');

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, true, true, ]

async function coreFunction(data) {
  const targetLine = 0
  let result = -1

  const checks = [1] // 1: perfect, 2: diff 1
  for (let y = 1; y < data.length; ++y) {
    for (let cy = 0; cy < y; ++cy) {
      const check = checks[cy]
      if (!check) continue
      // const tcy = cy - (y - cy - 1)
      const tcy = 2 * cy - y + 1
      if (tcy < 0) continue
      if (cy === targetLine) debugLog1({y, cy, tcy})
      if (cy === targetLine) debugLog1({yd: data[y], tcyd: data[tcy]})
      // checks[cy] = compareObject(data[y], data[tcy])
      let diff = 0
      for (let bi = 0; bi < data[y].length; ++bi) {
        if (data[y][bi] !== data[tcy][bi]) ++diff
        if (diff > 1) break
      }
      //
      let newCheck = check
      if (cy === targetLine) debugLog1({ check, diff })
      if (diff === 0) {
        // perfect
      } else if (diff === 1) {
        if (check === 1) newCheck = 2
        else newCheck = false
      } else {
        newCheck = false
      }
      if (cy === targetLine) debugLog1({ newCheck })
      checks[cy] = newCheck
    }
    if (y < data.length - 1) checks.push(1)
  }
  debugLog1({checks})
  result0 = checks.indexOf(1)
  result1 = checks.indexOf(2)

  await recordOutput([data], {result0, result1})
  return {result0, result1}
}

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, inputFilePath))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let data = []
  let sum = 0
  let obj, result
  let lineNo = -1
  for await (const line of rl) {
    ++lineNo
    if (!line) {
      debugLog('data')
      debugLog(data.map(line => line.join('')).join('\n'))
      obj = await coreFunction(data)
      debugLog({ obj })
      result = obj.result1
      debugLog({result})
      if (result >= 0) {
        sum += (result + 1) * 100
      } else {
        // transpose
        let newData = []
        for (let i = 0; i< data[0].length; ++i) {
          newData.push(data.map(d => d[i]))
        }
        debugLog('newData')
        debugLog(newData.map(line => line.join('')).join('\n'))
        obj = await coreFunction(newData)
        debugLog({ obj })
        result = obj.result1
        debugLog({result})
        if (result >= 0) {
          sum += result + 1
        } else {
          console.log('no ref', lineNo)
        }
      }

      data = []
      continue
    }
    //
    data.push(line.split(''))
  }

  debugLog('hi')

  console.log('====')
  console.log({sum})

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
