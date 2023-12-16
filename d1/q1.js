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
  for await (const line of rl) {
    const matches = line.match(/\d/g)
    const numStr = `${matches[0]}${matches[matches.length - 1]}`
    console.log(numStr)
    sum += Number.parseInt(numStr)
  }
  console.log('==========')
  console.log(sum)
}

main();
