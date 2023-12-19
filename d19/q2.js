const fs = require('fs')
const readline = require('readline')
const path = require('path')
const { rFact, compareObject } = require('../lib/lib')
const _ = require('lodash')
const { debug } = require('console')

// const inputFilePath = 'rules-test.txt'
const inputFilePath = 'rules.txt'
const muteFlags = [true, true, true, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function rangeAnd(range, condition) {
  const newRange = _.cloneDeep(range)
  if (!condition) return newRange
  switch(condition.operator) {
    case '>':
      newRange[condition.field][0] = Math.max(newRange[condition.field][0], condition.value + 1)
      break
    case '<':
      newRange[condition.field][1] = Math.min(newRange[condition.field][1], condition.value - 1)
      break
  }
  return newRange
}

function rangeCount(range) {
  const result = Object.values(range).reduce((product, r) => {
    return product * Math.max(0, r[1] - r[0] + 1)
  }, 1)
  // debugLog1({ range, result })
  return result
}

function condNot(condition) {
  switch(condition.operator) {
    case '>':
      return {
        ...condition,
        operator: '<',
        value: condition.value + 1,
      }
    case '<':
      return {
        ...condition,
        operator: '>',
        value: condition.value - 1,
      }
    default:
      throw new Error('!!')
  }
}

function resolveRange(range, ruleDatas, key, level) {
  if (!level) level = 0
  if (level === 0) debugLog1({ key })
  const ruleData = ruleDatas[key]
  let sum = 0
  let newRange = _.cloneDeep(range)
  for (let rule of ruleData) {
    if (level === 0) debugLog1({ newRange })
    const tarRange = rangeAnd(newRange, rule.condition)
    const rc = rangeCount(tarRange)
    if (level === 0) debugLog1({ tarRange, rc })
    if (rc) {
      switch(rule.value) {
        case 'A':
          sum += rc
          break
        case 'R':
          break
        default:
          sum += resolveRange(tarRange, ruleDatas, rule.value, level + 1)
          break
      }
    }
    if (!rule.condition) break
    newRange = rangeAnd(newRange, condNot(rule.condition))
    if (!rangeCount(rc)) break
  }
  return sum
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

  let ruleDatas = dataStr.split('\n').reduce((obj, line) => {
    const [key, others] = line.split(/[\{\}]/)
    // debugLog({key, others})
    const rules = others.split(',').map(str => {
      // debugLog({str})
      const [str0, str1] = str.split(':')
      if (!str1) {
        // debugLog({str0})
        return {
          condition: null,
          value: str0
        }
      } else {
        // debugLog({str0, str1})
        const [_, field, operator, valueStr] = str0.match(/(.+?)([><])(.+)/)
        const condition = {
          field,
          operator,
          value: Number.parseInt(valueStr),
        }
        return {
          condition,
          value: str1
        }
      }
    })
    obj[key] = rules
    return obj
  }, {})

  // debugLog(JSON.stringify(ruleDatas))

  let range = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
  const sum = resolveRange(range, ruleDatas, 'in')

  // console.log('====')
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
