const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { compareObject } = require('../lib/lib')

function canBeDamage(c) { return c === '#' || c === '?' }
function canBeOp(c) { return c === '.' || c === '?' }

const verbose = false

function possibilityCount(spring, setup, tracing) {
  if (setup.length === 0) {
    if (verbose) console.log('reach end')
    const valid = spring.every(canBeOp)
    if (valid) {
      const newTracing = tracing + new Array(spring.length + 1).join( '.' )
      if (verbose) console.log({newTracing})
    }
    return valid ? 1 : 0
  }
  if (verbose) console.log({setup})
  let targetCount = setup[0]
  const newSetup = setup.slice(1)
  if (verbose) console.log({targetCount, newSetup})
  const maxI = spring.length - (newSetup.reduce((sum, c) => sum + c + 1, 0)) - targetCount
  // const maxI = spring.length - (newSetup.reduce((sum, c) => sum + c + 1, 0))
  // const maxI = spring.length - 1
  if (verbose) console.log({spring, maxI})
  let sum = 0;

  for (let i = 0; i <= maxI; ++i) {
    // check if i is possible for targetCount
    if (verbose) console.log({ test: spring.slice(i, i + targetCount) })
    if (
      // all # in range
      spring.slice(i, i + targetCount).every(canBeDamage) &&
      // . before
      spring.slice(0, i).every(canBeOp) &&
      // . after
      (i + targetCount == spring.length || canBeOp(spring[i + targetCount])
    )) {
      let newTracing = tracing
      newTracing += new Array(i).join( '.' )
      newTracing += new Array(targetCount + 1).join( '#' )
      if (i + targetCount < spring.length) newTracing += '.'
      // check posibility of the rest
      sum += possibilityCount(spring.slice(i + targetCount + 1), newSetup, newTracing)
    }
    if (verbose) console.log({targetCount, maxI, i, sum})
  }
  if (verbose) console.log({targetCount, sum})
  return sum
}

async function main () {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let sum = 0
  // let datas = []
  for await (const line of rl) {
    let [_, spring, setup] = line.match(/(.*?) (.*)/)

    // double
    // spring = `${spring}?${spring}`
    // setup = `${setup},${setup}`

    // x5
    spring = `${spring}?${spring}?${spring}?${spring}?${spring}`
    setup = `${setup},${setup},${setup},${setup},${setup}`

    const data = {
      spring: spring.replace(/\.+/g, '.').replace(/^\.|\.$/g, '').split(''),
      setup: setup.split(',').map(c => Number.parseInt(c))
    }
    // datas.push(data)
    // console.log({data})

    const count = possibilityCount(data.spring, data.setup, '')
    console.log(`${data.spring.join('')} ${data.setup} ${count}`)
    sum += count
  }

  console.log('====')
  console.log({sum})

}

main();
