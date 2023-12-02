const { open } = require("fs/promises")

const getData = async (path) => {
  const file = await open(path)
  const content = await file.readFile('utf8')
  file.close()
  return content.split("\n").slice(0, -1)
}

const getMaxColorCount = (game, color) => {
  const regexp = new RegExp(`\(\\d+\)\\s${color}`, 'g')
  const matches = game.matchAll(regexp)
  const counts = [...matches].map(([_, count]) => +count)
  return Math.max(...counts)
}

const isGamePossible = (game, redTotal, greenTotal, blueTotal) => {
  const red = getMaxColorCount(game, 'red')
  const green = getMaxColorCount(game, 'green')
  const blue = getMaxColorCount(game, 'blue')
  return red <= redTotal && green <= greenTotal && blue <= blueTotal
}

const getGameId = (game) => {
  return +game.match(/Game\s(\d+)/)[1]
}

// multiple of fewest number of cubes of each color
const getMinimumSetOfGame = (game) => {
  const red = getMaxColorCount(game, 'red')
  const green = getMaxColorCount(game, 'green')
  const blue = getMaxColorCount(game, 'blue')

  return red * green * blue
}

const part1 = async () => {
  const RED_TOTAL  =12
  const GREEN_TOTAL = 13
  const BLUE_TOTAL = 14
  const data = await getData("./part1.txt")
  return data
    .filter((line) => isGamePossible(line, RED_TOTAL, GREEN_TOTAL, BLUE_TOTAL))
    .map((line) => getGameId(line))
    .reduce((sum, id) => sum += id, 0)
}

const part2 = async () => {
  const data = await getData("./part1.txt")
  return data
    .map((line) => getMinimumSetOfGame(line))
    .reduce((sum, minimumSet) => sum += minimumSet, 0)
}

const main = async () => {
  console.log({
    part1: await part1(),
    part2: await part2()
  })
}

main()
