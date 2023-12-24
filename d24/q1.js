const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')
const { devNull } = require('os')
const { takeCoverage } = require('v8')

// const inputFilePath = 'input-test.txt'
// const boundMin = 7
// const boundMax = 27
// const muteFlags = [false, false, false, ]

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const boundMin = 200000000000000
const boundMax = 400000000000000
const muteFlags = [true, true, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function checkCollisionXY(data0, data1, boundaries) {
  const relativePos1 = lib.rv3Minus(data1.pos, data0.pos)
  if (relativePos1[0] === 0 && relativePos1[1] === 0) throw new Error('same point')
  // point of intersection
  // https://www.vedantu.com]/formula/point-of-intersection-formula
  const {a: a1, b: b1, c: c1} = data0
  const {a: a2, b: b2, c: c2} = data1
  const divider1 = a1*b2 - a2*b1
  const divider2 = a1*b2 - a2*b1
  if (divider1 === 0 || divider2 === 0) {
    debugLog1('never intersect')
    return false
  }
  const intPos = [
    (b1*c2 - b2*c1) / divider1,
    (c1*a2 - c2*a1) / divider2
  ]
  debugLog1({ intPos })
  // check if pass
  if (
    (intPos[0] - data0.pos[0]) / data0.vel[0] < 0 ||
    (intPos[1] - data0.pos[1]) / data0.vel[1] < 0 ||
    (intPos[0] - data1.pos[0]) / data1.vel[0] < 0 ||
    (intPos[1] - data1.pos[1]) / data1.vel[1] < 0
  ) {
    debugLog1('cross in pass')
    return false
  }
  // check boundaries
  if (
    intPos[0] <  boundaries[0][0] ||
    intPos[0] >  boundaries[1][0] ||
    intPos[1] <  boundaries[0][1] ||
    intPos[1] >  boundaries[1][1]
  ) {
    debugLog1('out bound')
    return false
  }
  // TODO:
  return intPos
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
  let datas = lines.map(line => {
    const [_, px, py, pz, vx, vy, vz] = line.match(/(-?\d+), +(-?\d+), +(-?\d+) +@ +(-?\d+), +(-?\d+), +(-?\d+)/)
    const pos = [Number.parseInt(px), Number.parseInt(py), Number.parseInt(pz)]
    const vel = [Number.parseInt(vx), Number.parseInt(vy), Number.parseInt(vz)]
    return {
      pos,
      vel,
      // convert to formula ax + by + c = 0  =>  (vy)x + (-vx)y = -c  =>
      // a: vel[1],
      // b: -vel[0],
      // c: vel[0] * pos[1] - vel[1] * pos[0],
      a: 1,
      b: -vel[0] / vel[1],
      c: vel[0] * pos[1] / vel[1] - pos[0],
    }
  })

  // const lines = fs.readFileSync(process.stdin.fd).toString().replace('\r', '').split("\n");

  // debugLog({datas: JSON.stringify(datas, null, 2)})

  let boundaries = [[boundMin, boundMin, 0], [boundMax, boundMax, 0]]
  let sum = 0
  for (let index = 0; index < datas.length - 1; ++index) {
    for (let index2 = index + 1; index2 < datas.length; ++ index2) {
      // debugLog(datas[index])
      // debugLog(datas[index2])
      const intPos = checkCollisionXY(datas[index], datas[index2], boundaries)
      debugLog(`${datas[index].pos[0]} ${datas[index].pos[1]} ${datas[index].pos[2]} - ${datas[index2].pos[0]} ${datas[index2].pos[1]} ${datas[index2].pos[2]} ${!!intPos}`)
      if (intPos) {
        // debugLog({intPos})
        ++sum
      }
      // debugLog("")
    }
  }

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
