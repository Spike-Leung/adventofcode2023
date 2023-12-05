const { open } = require('fs/promises')

const getData = async (path) => {
  const file = await open(path)
  const content = await file.readFile('utf8')
  file.close()
  return content.split('\n').slice(0, -1)
}

const getSeeds = (data = []) => {
  const [_, seeds] = data[0].split(':')
  return seeds.split(' ').filter((n) => n !== '').map((n) => +n)
}

const getMaps = (data = []) => {
  return data
    .slice(1)
    .reduce((maps, line) => {
      if (line === '') return maps

      if (line.indexOf('map') !== -1) {
        maps.push([])
        return maps
      }

      const category = line.split(' ').map((n) => +n)
      maps[maps.length - 1].push(category)

      return maps
    }, [])
    .map((map) => map.sort((a, b) => a[0] - b[0]))
}

const getTargetFromMap = (map = [], source) => {
  // by default, target is same as source
  let target = source

  // if target in srouce range, then map target to destination
  for (const [dst, src, range] of map) {
    const min = src
    const max = src + range - 1

    if (source >= min && source <= max) {
      const diff = target - min
      target = dst + diff
      break
    }
  }
  return target
}

const getLocations = (maps = [], source) => {
  return maps.reduce((target, map, index) => {
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#currentindex
    // The index position of currentValue in the array. On the first call, its value is 0 if initialValue is specified, otherwise 1.
    if (index === 0) {
      return getTargetFromMap(map, source)
    }

    return getTargetFromMap(map, target)
  }, -1)
}

const part1 = async () => {
  const data = await getData('./part1.txt')
  const seeds = getSeeds(data)
  const maps = getMaps(data)

  return Math.min(...seeds.map((s) => getLocations(maps, s)))
}

// TODO: out of memory
const part2 = async () => {
  const data = await getData('./part1.txt')
  const seeds = getSeeds(data)
  const maps = getMaps(data)

  let lowestLocation = Number.MAX_SAFE_INTEGER
  const searchedLocation = {}

  for (let i = 0; i < seeds.length; i += 2) {
    const seedSrc = seeds[i]
    const seedRange = seeds[i + 1]

    continue

    for (let j = 0; j < seedRange; j++) {
      const start = seedSrc + j

      if (searchedLocation[start]) return

      const location = getLocations(maps, start)
      searchedLocation[start] = location
      lowestLocation = Math.min(lowestLocation, location)
    }
  }

  return lowestLocation
}

const main = async () => {
  console.log({
    part1: await part1(),
    part2: await part2()
  })
}

main()
