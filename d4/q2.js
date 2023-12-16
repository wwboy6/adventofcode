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
  const addCopies = [0];
  let index = 0;
  for await (const line of rl) {
    const dataStr = line.match(/Card\s+\d+: (.*)/)[1]
    const cardDatas = dataStr.split(' | ')
    const winNums = cardDatas[0].split(' ').filter(v => !!v).map(v => Number.parseInt(v))
    console.log({winNums})
    const numbers = cardDatas[1].split(' ').filter(v => !!v).map(v => Number.parseInt(v))
    console.log({numbers})
    const myWinningNums = numbers.filter(num => winNums.some(n => n === num))
    console.log({myWinningNums})

    const instance = 1 + (addCopies[index] || 0);
    console.log({ index, instance })
    sum += instance;
    for (let i = 0; i < myWinningNums.length; ++i) {
      addCopies[i + index + 1] = instance + (addCopies[i + index + 1] || 0)
    }
    ++index;
  }
  console.log('==========')
  console.log(sum)
}

main();
