const fs = require('fs')
const readline = require('readline')

async function main() {

  const file = fs.createReadStream('./out.txt')
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  const file2 = fs.createReadStream('./out2.txt')
  const rl2 = readline.createInterface({
    input: file2,
    crlfDelay: Infinity,
  })
  const rl2Iterator = rl2[Symbol.asyncIterator]()
  
  for await (let line of rl) {
    line = line.replace('\r', '')
    const line2 = (await rl2Iterator.next()).value
    if (line !== line2) {
      console.log(line)
      console.log(line2)
      break
    }
  }

  file.close()
  rl.close()
  file2.close()
  rl2.close()

  console.log('done')
}

main()
