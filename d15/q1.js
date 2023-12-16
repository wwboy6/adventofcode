const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { rFact, compareObject } = require('../lib/lib');

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, true, true, ]

// "\n".charCodeAt(0);

function getHash(str) {
  debugLog1({str})
  return str.split('').reduce((sum, char) => {
    debugLog1({sum, char})
    const hash = char.charCodeAt(0) 
    sum = ((sum + hash) * 17) % 256
    debugLog1({sum, hash})
    return sum
  }, 0)
}

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, inputFilePath))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let sum = 0
  let boxes = Array(256).fill(0).map(() => { return [] })
  for await (const line of rl) {
    const data = line.split(',')
    //
    data.forEach(str => {
      let [_, label, focalLength] = str.match(/(.+)(?:=|-)(.*)/)
      focalLength = Number.parseInt(focalLength)
      debugLog({str, label, focalLength})
      let hash = getHash(label)
      let box = boxes[hash]
      let lens
      debugLog({hash})
      debugLog({ box })
      if (focalLength) {
        lens = box.find(box => box.label === label)
        if (!lens) {
          lens = {
            label, focalLength
          }
          box.push(lens)
        } else {
          // replace existing
          lens.focalLength = focalLength
        }
      } else {
        // remove
        boxes[hash] = box.filter(box => box.label !== label)
      }
      // debugLog({boxes})
      debugLog({ box })
      debugLog("=====")
    })
  }

  // debugLog({boxes})

  sum = boxes.reduce((sum, box, boxI) => {
    let boxSum = 0
    for (let i = 0; i < box.length; ++i) {
      let lenV = (boxI + 1) * (i + 1) * box[i].focalLength
      debugLog({lenV})
      boxSum += lenV
    }
    return sum += boxSum
  }, 0)

  console.log('====')
  console.log({sum})
  // console.log({result})

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

// module.exports = {
//   coreFunction,
// }
