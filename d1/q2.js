const fs = require('fs')
const readline = require('readline');
const path = require('path')

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })
  let sum = 0;
  const numberNames = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  ]
  const regexStr = numberNames.reduce((regexStr, name) => {
    return `${regexStr}|${name}`
  }, `\\d`)
  console.log(regexStr)
  // return;
  const numberRegex = new RegExp(regexStr)
  const numberRegex2 = new RegExp(`.*(${regexStr})`)
  for await (const line of rl) {
    const selM = [
      line.match(numberRegex)[0],
      line.match(numberRegex2)[1],
    ]
    console.log(selM)
    const numStr = ''.concat(...selM.map(str => {
      const index = numberNames.indexOf(str)
      if (index >= 0) return `${index}`;
      return str
    }))
    console.log(numStr)
    sum += Number.parseInt(numStr)
  }
  console.log('==========')
  console.log(sum)
}

main();
