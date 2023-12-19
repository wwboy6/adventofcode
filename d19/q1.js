const fs = require('fs')
const readline = require('readline')
const path = require('path')
const { rFact, compareObject } = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
// const rulesFilePath = 'rules-test.txt'
const inputFilePath = 'input.txt'
const rulesFilePath = 'rules.txt'
const muteFlags = [false, false, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function checkCondition(condition, data) {
  if (!condition) return true
  switch(condition.operator) {
    case '>':
      return data[condition.field] > condition.value
    case '<':
      return data[condition.field] < condition.value
    default:
      return true
  }
}

function acceptData(data, ruleDatas) {
  let key = 'in'
  do {
    const rules = ruleDatas[key]
    for (let rule of rules) {
      if (checkCondition(rule.condition, data)) {
        key = rule.value
        break;
      }
    }
  } while(key !== 'A' && key !== 'R')
  return key === 'A'
}

async function main () {
  const filePath = path.resolve(__dirname, inputFilePath)
  const ruleFilePath = path.resolve(__dirname, rulesFilePath)

  // const file = fs.createReadStream(filePath)
  // const rl = readline.createInterface({
  //   input: file,
  //   crlfDelay: Infinity,
  // })
  // for await (const line of rl) {
  // }

  const dataStr = await fs.promises.readFile(filePath, 'utf8')
  let data = dataStr.split('\n').map(line => {
    return line.replace(/[\{\}]/g, '').split(',').reduce((obj, str) => {
      const [field, valueStr] = str.split('=')
      obj[field] = Number.parseInt(valueStr)
      return obj
    }, {})
  })
  // debugLog({data: JSON.stringify(data)})
  const rulesStr = await fs.promises.readFile(ruleFilePath, 'utf8')
  let rules = rulesStr.split('\n').reduce((obj, line) => {
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
  // debugLog(JSON.stringify(rules, null, 2))

  const sum = data.filter(d => {
    const accept = acceptData(d, rules)
    // debugLog({accept})
    return accept
  }).reduce((sum, d) => {
    return sum + Object.values(d).reduce((s, v) => s+v, 0)
  }, 0)

  // debugLog({dataStr})

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
