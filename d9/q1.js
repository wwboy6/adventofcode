const fs = require('node:fs')
const readline = require('node:readline')
const path = require('path')

function prediceNext(data) {
  // console.log(data)
  if (data.every(d => d === 0)) return 0
  const nextData = []
  for (let i = 0; i < data.length - 1; ++i) {
    nextData.push(data[i + 1] - data[i])
  }
  const nextDiff = prediceNext(nextData)
  return data[data.length - 1] + nextDiff
}

async function main() {
  const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test'))
  const rl = readline.createInterface({
    input: file,
    culfDelay: Infinity, 
  })

  let datas = []
  for await (const line of rl) {
    // console.log(line)
    datas.push(line.split(' ').map(v => Number.parseInt(v)))
  }
  // console.log({ datas })

  let sum = datas.reduce((sum, data) => {
    const next = prediceNext(data)
    console.log({ next })
    return sum + next
  }, 0)

  console.log('=====')
  console.log({ sum })
}

main()