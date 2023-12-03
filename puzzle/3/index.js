const { open } = require('fs/promises')

const getData = async (path) => {
  const file = await open(path)
  const content = await file.readFile('utf8')

  file.close()

  return content.split('\n').slice(0, -1)
}

const isNumber = (char) => !Number.isNaN(+char)

const getNumber = (line, numberIndex) => {
  let number = line[numberIndex]
  let left = numberIndex - 1
  let right = numberIndex + 1

  while (left >= 0 && isNumber(line[left])) {
    number = `${line[left]}${number}`
    left--
  }

  while (right < line.length && isNumber(line[right])) {
    number = `${number}${line[right]}`
    right++
  }

  // return number, and index of number left and right
  return { number: +number, left: left + 1, right: right - 1 }
}

const getSymbolPositions = (matrix, filterSymbols = []) => {
  const symbolPositions = []

  matrix.forEach((line, y) => {
    line.forEach((val, x) => {
      if (filterSymbols.length && !filterSymbols.includes(val)) return
      if (val !== '.' && !/\d/.test(val)) {
        symbolPositions.push([x, y])
      }
    })
  })

  return symbolPositions
}

const findAdjacentNumber = (matrix, symbolPositions) => {
  const res = []
  const searchedNumberkeys = {}
  const directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

  symbolPositions.forEach(([x, y]) => {
    directions.forEach(([dx, dy]) => {
      const newX = +x + dx
      const newY = +y + dy

      if (newX < 0 || newY < 0 || newX > matrix[0].length || newY > matrix.length) {
        return
      }

      if (isNumber(matrix[newY][newX])) {
        const { number, left, right } = getNumber(matrix[newY], newX)
        const key = `${newY}${left}${right}`

        if (searchedNumberkeys[key]) {
          return
        }

        searchedNumberkeys[key] = true
        res.push(number)
      }
    })
  })

  return res
}

const findGeerRatio = (matrix, symbolPositions) => {
  const res = []
  const searchedNumberkeys = {}
  const directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]

  symbolPositions.forEach(([x, y]) => {
    const nums = []

    directions.forEach(([dx, dy]) => {
      const newX = +x + dx
      const newY = +y + dy

      if (newX < 0 || newY < 0 || newX > matrix[0].length || newY > matrix.length) {
        return
      }

      if (isNumber(matrix[newY][newX])) {
        const { number, left, right } = getNumber(matrix[newY], newX)
        const key = `${newY}${left}${right}`

        if (searchedNumberkeys[key]) {
          return
        }

        searchedNumberkeys[key] = true
        nums.push(number)
      }
    })

    if (nums.length === 2) {
      res.push(nums[0] * nums[1])
    }
  })

  return res
}

const part1 = async () => {
  const data = await getData('./part1.txt')
  const matrix = data.map((line) => line.split(''))
  const nums = findAdjacentNumber(matrix, getSymbolPositions(matrix))
  return nums.reduce((acc, num) => acc += num, 0)
}

const part2 = async () => {
  const data = await getData('./part1.txt')
  const matrix = data.map((line) => line.split(''))
  const nums = findGeerRatio(matrix, getSymbolPositions(matrix, ['*']))
  return nums.reduce((acc, num) => acc += num, 0)
}

const main = async () => {
  console.log({
    part1: await part1(),
    part2: await part2()
  })
}

main()
