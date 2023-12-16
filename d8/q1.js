const fs = require('fs')
const readline = require('readline');
const path = require('path')

async function main () {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let sum = 0;
  let readingSteps = true;
  let steps;
  const map = {}
  for await (const line of rl) {
    if (readingSteps) {
      steps = [...line.match(/\w/g)]
      readingSteps = false
      continue
    }
    if (!line) continue
    const [ _, key, L, R ] = line.match(/(\w+) = \((\w+), (\w+)\)/)
    map[key] = {
      L, R
    }
  }
  
  let stepI = 0;
  let loc = 'AAA'
  let i = 1
  for (i = 1; true; ++i) {
    const step = steps[stepI]
    loc = map[loc][step]
    if (loc === 'ZZZ') break;
    console.log({step, loc})
    stepI = (stepI + 1) % steps.length
  }

  console.log('==========')
  // console.log(sum)
  console.log(i)
}

main();
