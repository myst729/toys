// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function roll (...list) {
  let i = list.length
  let j
  let temp

  if (i > 1) {
    while (--i) {
      j = Math.floor(Math.random() * (i + 1))
      temp = list[i]
      list[i] = list[j]
      list[j] = temp
    }
  }
  return list
}

export default function shuffle (n, ...list) {
  let result = list
  while (n--) {
    result = roll(...result)
  }
  return result
}
