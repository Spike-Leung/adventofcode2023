const { open } = require('fs/promises')

const getData = async (path) => {
  const file = await open(path)
  const content = await file.readFile('utf8')
  file.close()
  return content.split('\n').slice(0, -1)
}

const part1 = async () => {
  const data = await getData('./part1.txt')

  return data
    .map((line) => {
      const nums = line.match(/\d/g)
      const first = nums[0]
      const last = nums[nums.length -1]
      return +`${first}${last}`
    })
    .reduce((sum, num) => sum += num, 0)
}

const transformCharNumber = (str) => {
  const map = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
  }

  if (Number.isNaN(+str)) {
    return map[str]
  }

  return +str
}

function extractNumber(line) {
  const regex = /one|two|three|four|five|six|seven|eight|nine|\d/g
  const nums = []

  let execResult = regex.exec(line)

  // The right calibration values for string "eighthree" is 83 and for "sevenine" is 79.
  // see: https://www.reddit.com/r/adventofcode/comments/1884fpl/2023_day_1for_those_who_stuck_on_part_2/
  while (execResult) {
    const [val] = execResult
    const { index } = execResult
    nums.push(val)
    regex.lastIndex -= (val.length - 1)
    execResult = regex.exec(line)
  }

  return nums;
}

const part2 = async () => {
  const data = await getData('./part1.txt')
  const matchResult = []

  const sum =  data
        .map((line) => {
          const nums = extractNumber(line)
          const first = transformCharNumber(nums[0])
          const last = transformCharNumber(nums[nums.length -1])

          matchResult.push({ str: line, first, last, number: +`${first}${last}`})
          return +`${first}${last}`
        })
        .reduce((sum, num) => sum += num, 0)

  console.table(matchResult)
  return sum
}

const main = async () => {
  console.log({ part1: await part1() })
  console.log({ part2: await part2() })
}

main()
