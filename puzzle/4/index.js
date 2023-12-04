const { open } = require('fs/promises')

const getData = async (path) => {
  const file = await open(path)
  const content = await file.readFile('utf8')
  file.close()

  return content.split('\n').slice(0, -1)
}

const getPoints = (winningNumberCount = 0) => {
  return winningNumberCount <= 1 ? winningNumberCount : Math.pow(2, winningNumberCount - 1)
}

const getWinningNumberCount = (card) => {
  const [_, numberListStr] = card.split(':')
  const [winningNumbersStr, numbersStr] = numberListStr.split('|')
  const winningNumbers = winningNumbersStr.split(' ').filter((i) => i !== '')
  const numbers = numbersStr.split(' ').filter((i) => i !== '')

  return numbers.filter((n) => winningNumbers.includes(n)).length
}

const getCardId = (card) => +card.match(/Card\s+(\d+):/)[1]

const part1 = async () => {
  const data = await getData('./part1.txt')

  return data
    .map((card) => getPoints(getWinningNumberCount(card)))
    .reduce((sum, point) => sum += point, 0)
}

const part2 = async () => {
  const data = await getData('./part1.txt')
  const winningCardCountMap = {}
  const maxCardId = getCardId(data[data.length - 1])

  data.forEach((card) => {
    const cardId = getCardId(card)
    const count = getWinningNumberCount(card)

    // each original have 1
    if (winningCardCountMap[cardId] === undefined) {
      winningCardCountMap[cardId] = 1
    }  else {
      winningCardCountMap[cardId] += 1
    }

    let repeatCount = winningCardCountMap[cardId]

    // repeat each card's count, add to next other card
    while (repeatCount > 0) {
      repeatCount--

      for (let i = 1; i <= count; i++) {
        const nextCardId = cardId + i

        // if exceed max cardId, do not add anymore
        if (nextCardId > maxCardId) {
          break
        }

        if (winningCardCountMap[nextCardId] === undefined) {
          winningCardCountMap[nextCardId] = 1
        } else {
          winningCardCountMap[nextCardId] += 1
        }
      }
    }
  })

  return Object.values(winningCardCountMap).reduce((sum, count) => sum += count, 0)
}

const main = async () => {
  console.log({
    part1: await part1(),
    part2: await part2(),
  })
}

main()
