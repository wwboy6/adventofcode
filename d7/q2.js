const fs = require('fs')
const readline = require('readline');
const path = require('path')

const cardOrder = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']
const jOrder = cardOrder.indexOf('J')

function handRank(cards) {
  let uniqueCardNumbers = [... new Set(cards)].filter(n => n != jOrder)
  console.log({uniqueCardNumbers})
  const jCount = cards.filter(c => c === jOrder).length
  console.log({jCount})

  let [first = 0, second = 0] = uniqueCardNumbers.map(ucn => cards.filter(c => c === ucn).length).sort((c0, c1) => c1 - c0) // decending
  console.log({first, second})

  // check Five of a kind (6)
  if (first + jCount === 5) return 6

  // check Four of a kind (5)
  if (first + jCount === 4) return 5

  // Full house (4)
  if (first + second + jCount >= 5) return 4
  
  // check Three of a kind (3)
  if (first + jCount >= 3) return 3

  // check Two pair (2)
  if (first + second + jCount >= 4) return 2
  
  // One pair (1)
  if (first + jCount >= 2) return 1

  return 0
}

function printdata(data) {
  return {
    ...data,
    cards: data.cards.join(' ')
  }
}

async function main () {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let sum = 0;
  let datas = [];
  for await (const line of rl) {
    const [cardsStr, bidStr] = line.split(' ')
    const cards = [... cardsStr.match(/./g)].map(c => cardOrder.indexOf(c))
    console.log({ cards })
    const rank = handRank(cards)
    console.log({ rank })
    console.log("======")
    datas.push({
      order: 0,
      rank,
      cards,
      bid: Number.parseInt(bidStr),
    })
  }
  console.log({ datas: datas.map(printdata) })

  datas = datas.sort((data0, data1) => {
    let result = data0.rank - data1.rank
    if (result === 0) {
      // result = data0.cards[0] - data1.cards[0]
      for (let i = 0; i < 5; ++i) {
        const diff = data0.cards[i] - data1.cards[i]
        if (diff !== 0) {
          result = diff
          break
        }
      }
    }
    return result
  })
  console.log({ sorted: datas.map(printdata) })

  for (let i = 0; i < datas.length; ++i) {
    datas[i].order = i + 1
  }
  console.log({ ordered: datas.map(printdata) })

  sum = datas.reduce((s, data) => {
    return s + data.order * data.bid
  }, 0)

  console.log('==========')
  console.log(sum)
}

main();
