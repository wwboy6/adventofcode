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
  let gameId = 0;
  const requirement = [
    { type: 'red', amount: 12 },
    { type: 'green', amount: 13 },
    { type: 'blue', amount: 14 },
  ]
  for await (const line of rl) {
    // parse data
    const dataStr = line.match(/Game \d+: (.*)/)[1]
    ++gameId
    const datas = dataStr.split('; ').map(dataSubStr => {
      return dataSubStr.split(', ').map(entryStr => {
        const entryDatas = entryStr.split(' ')
        return {
          type: entryDatas[1],
          amount: Number.parseInt(entryDatas[0])
        }
      })
    })
    // check data
    const isValid = datas.every(data => data.every(entry => {
      const ei = requirement.findIndex(r => r.type === entry.type)
      return requirement[ei].amount >= entry.amount
    } ))
    if (isValid) {
      sum += gameId
    }
  }
  console.log('==========')
  console.log(sum)
}

main();
