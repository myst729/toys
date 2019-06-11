// Brute Force string search algorithm
function bruteForce (string, pattern) {
  let str = string.split('')
  let pat = pattern.split('')
  let sl = str.length
  let pl = pat.length

  let i = 0
  let j = 0
  while (i + j < sl) {
    if (pat[i] === str[i + j]) {
      i++
      if (i === pl) {
        return j
      }
    } else {
      j++
      i = 0
    }
  }
  return -1
}
