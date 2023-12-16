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

  const symbols = []
  const numbers = []
  let lineIndex = 0;
  for await (const line of rl) {
    ++lineIndex;
    const datas = line.match(/\d+|[^.]/g)
    lastI = 0
    for (const d of datas) {
      const index = line.indexOf(d, lastI)
      lastI = index + d.length
      // symbol
      const number = Number.parseInt(d)
      const entry = {
        line: lineIndex,
        index,
        value: d,
        valueLength: d.length,
        number,
      }
      if (!number) {
        symbols.push(entry)
        continue
      }
      // number
      numbers.push(entry)
    }
  }
  // check numbers and sum
  for (const number of numbers) {
    if (
      symbols.some(sym =>
        ((sym.line >= number.line - 1 && sym.line <= number.line + 1) && (
          sym.index >= number.index - 1 && sym.index <= number.index + number.valueLength
        ))
      )
    ) {
      sum += Number.parseInt(number.number)
    }
  }
  console.log('==========')
  console.log(sum)
}

main();
