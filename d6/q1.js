const fs = require('fs')
const readline = require('readline');
const path = require('path')

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })
  let answer = 1;

  let lineI = 0
  let datas = []
  for await (const line of rl) {
    if (lineI === 0) {
      datas = line.match(/\d+/g).map(str => { return {time: Number.parseInt(str)} } )
      console.log({datas})
    }
    if (lineI === 1) {
      const distances = line.match(/\d+/g).map(str => Number.parseInt(str))
      for (let index in datas) {
        index = Number.parseInt(index)
        console.log({index})
        datas[index].distance = distances[index]
      }
    }
    ++lineI
  }
  
  for (const data of datas) {
    let count = 0;
    for (let t = 1; t < data.time - 1; ++t) {
      if (t * (data.time - t) > data.distance) ++count
    }
    console.log({count})
    answer *= count
  }

  console.log('==========')
  console.log({answer})
}

main();
