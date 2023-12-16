const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { compareObject } = require('../lib/lib')

async function main () {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let xHasStar = [], yHasStar = [], stars = []
  let y = 0
  for await (const line of rl) {
    for (let x = 0; x < line.length; ++x) {
      const char = line[x]
      if (char !== '.') {
        stars.push({x, y})
        xHasStar[x] = true
        yHasStar[y] = true
      } else {
        xHasStar[x] = !!xHasStar[x]
        yHasStar[y] = !!yHasStar[y]
      }
    }
    ++y
  }

  // console.log({ xHasStar, yHasStar, stars})

  let sum = 0;

  for (let i = 1; i < stars.length; ++i) {
    for (let j = 0; j < i; ++j) {
      start = stars[i]
      end = stars[j]
      // check distance btw 2 points
      // x

      // start = { x: 3, y: 0 }
      // end = { x: 7, y: 8 }

      let xMin = Math.min(start.x, end.x)
      let xMax = Math.max(start.x, end.x)
      let xExpan = xHasStar.slice(xMin + 1, xMax).filter(has => !has).length
      // console.log({xExpan})
      let xDiff = xMax - xMin + xExpan * (1000000 - 1)
      // console.log({xDiff})
      // y
      let yMin = Math.min(start.y, end.y)
      let yMax = Math.max(start.y, end.y)
      let yExpan = yHasStar.slice(yMin + 1, yMax).filter(has => !has).length
      // console.log({yExpan})
      let yDiff = yMax - yMin + yExpan * (1000000 - 1)
      // console.log({yDiff})
      let dist = xDiff + yDiff
      // console.log({ dist })

      sum += dist

    }
  }

  console.log('====')
  console.log({sum})

}

main();
