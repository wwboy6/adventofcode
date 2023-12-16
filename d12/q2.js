const fs = require('fs')
const readline = require('readline');
const path = require('path');
const { off } = require('process');
// const { compareObject } = require('../lib/lib')

function canBeDamage(c) { return c === '#' || c === '?' }
function canBeOp(c) { return c === '.' || c === '?' }

const verbose = false
const verbose1 = false

function rFact(num)
{
  if (num === 0)
    { return 1; }
  else
    { return num * rFact( num - 1 ); }
}

function resolveGroups(groups, setup) {
  if (!groups.length) {
    return setup.length ? 0 : 1
  }
  // one possibility for no setup: all .
  if (!setup.length) return 1
  // TODO: shortcut: spring.len >= sum setup
  // TODO: try all combination of setup with first group, and recursion for the rest
  const firstGroup = groups[0]
  const newGroup = groups.slice(1)
  if(verbose) console.log({ firstGroup, newGroup })
  let sum = 0
  for (let size = 0; size <= setup.length; ++ size) {
    const newSetup = setup.slice(0, size)
    if (verbose) console.log({ newSetup })
    // check possibility for first group
    const space = firstGroup - (size - 1) - newSetup.reduce((sum, c) => sum + c, 0)
    if (space < 0) break;
    let combination;
    if (newSetup.length === 0 || space === 0) combination = 1
    else {
      const slot = newSetup.length + 1
      if(verbose) console.log({ space, slot })
      // combination of space aginst slot
      // https://en.wikipedia.org/wiki/Stars_and_bars_(combinatorics)
      const n = space + slot - 1
      const r = slot - 1
      // C(n,r) = n! ( (n-r)! r! )
      combination = rFact(n) / rFact(n-r) / rFact(r)
      if(verbose) console.log({ combination })
    }
    const possOfRest = resolveGroups(newGroup, setup.slice(size))
    if (verbose) console.log({ possOfRest })
    sum += combination * possOfRest
  }
  if (verbose) console.log({groups, setup, sum})
  return sum
}

// count with no known damage left
function possibilityCount(spring, setup) {
  if (verbose) console.log({spring, setup, len: setup.length})
  // one possibility for no setup: all .
  if (!setup.length) return 1
  //
  const groups = spring.split('.').map(str => str.length)
  if (verbose) console.log({groups})
  return resolveGroups(groups, setup)
}

function reduceKnownDamage (spring, setup, level) {
  if (!level) level = 0
  // find first #
  // TODO: finish it in 1 op
  const index = spring.indexOf('#')
  // check if no known damage left
  if (index < 0) return possibilityCount(spring, setup)
  // possibilities is 0 if # exist without setup
  if (!setup.length) return 0
  const length = spring.match(/#+/)[0].length
  if (verbose && level === 0) console.log({ index, length })
  // match all possibilities with setup
  let sum = 0;
  for (let i = 0; i < setup.length + 1; ++i) {
    const targetCount = setup[i]
    for (let offset = length - targetCount; offset <= 0; ++offset) {
      // check if the range meet requirement
      const newIndex = index + offset
      if (newIndex < 0) continue
      if (
        [...spring.slice(newIndex, newIndex + targetCount)].every(canBeDamage) &&
        // . before - must be true
        // . after
        (newIndex + targetCount == spring.length || canBeOp(spring[newIndex + targetCount]))
      ) {
        if (verbose && level === 0) console.log({ i, offset, newIndex })
        // split spring / setup into 2 parts
        let newSpring = spring.slice(0, Math.max(0,newIndex - 1))
        let newSetup = setup.slice(0, i)
        let possibilities0 = reduceKnownDamage(newSpring, newSetup, level + 1)
        if (verbose && level === 0) console.log({newSpring, newSetup, possibilities0})
        if (!possibilities0) continue

        newSpring = spring.slice(newIndex + targetCount + 1)
        newSetup = setup.slice(i+1)
        let possibilities1 = reduceKnownDamage(newSpring, newSetup, level + 1)
        if (verbose && level === 0) console.log({newSpring, newSetup, possibilities1})
        if (!possibilities1) continue

        const total = possibilities0 * possibilities1
        if (verbose && level === 0) console.log('==========', { total })

        sum += total
      }
    }
  }
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
    const [_, spring, setup] = line.match(/(.*?) (.*)/)
    let spring2 = spring
    let setupArr = setup.split(',').map(c => Number.parseInt(c))

    spring2 = `${spring2}?${spring2}?${spring2}?${spring2}?${spring2}`
    setupArr = [...setupArr, ...setupArr, ...setupArr, ...setupArr, ...setupArr]

    // TODO: double
    // spring2 = `${spring2}?${spring2}`
    // setupArr = [...setupArr, ...setupArr]

    spring2 = spring2.replace(/\.+/g, '.').replace(/^\.|\.$/g, '')

    const data = {
      spring: spring2,
      setup: setupArr,
    }
    // datas.push(data)
    // console.log({data})

    const count = reduceKnownDamage(data.spring, data.setup)
    console.log(`${data.spring} ${data.setup} ${count}`)
    sum += count
  }

  console.log('====')
  console.log({sum})

}

main();
// resolveGroups([7], [1, 1, 1])
