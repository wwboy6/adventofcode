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
    const dataStr = line.match(/Card\s+\d+: (.*)/)[1]
    const cardDatas = dataStr.split(' | ')
    const winNums = cardDatas[0].split(' ').filter(v => !!v).map(v => Number.parseInt(v))
    const numbers = cardDatas[1].split(' ').filter(v => !!v).map(v => Number.parseInt(v))
    const myWinningNums = numbers.filter(num => winNums.some(n => n === num))
    if (myWinningNums.length) sum += Math.pow(2, (myWinningNums.length - 1))
  }
  console.log('==========')
  console.log(sum)
}

main();
