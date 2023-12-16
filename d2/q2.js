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
  // let gameId = 0;
  for await (const line of rl) {
    // parse data
    const dataStr = line.match(/Game \d+: (.*)/)[1]
    // ++gameId
    // check min
    const minSet = [
      { type: 'red', amount: 0 },
      { type: 'green', amount: 0 },
      { type: 'blue', amount: 0 },
    ]
    //
    const datas = dataStr.split('; ').map(dataSubStr => {
      return dataSubStr.split(', ').map(entryStr => {
        const entryDatas = entryStr.split(' ')
        const entry = {
          type: entryDatas[1],
          amount: Number.parseInt(entryDatas[0])
        }
        const si = minSet.findIndex(r => r.type === entry.type)
        minSet[si].amount = Math.max(minSet[si].amount, entry.amount)
        return entry
      })
    })
    console.log(minSet)
    sum += minSet.reduce((total, se) => total * se.amount, 1)
  }
  console.log('==========')
  console.log(sum)
}

main();
