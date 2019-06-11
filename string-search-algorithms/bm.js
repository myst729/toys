// Boyer-Moore string search algorithm
function bmSearch (string, pattern) {
  let str = string.split('')
  let pat = pattern.split('')
  let sl = str.length
  let pl = pat.length

  // construct the jump table based on the mismatched character information
  let charTable = {}
  for (let i = 0; i < pl - 1; i++) {
    charTable[pat[i]] = pl - 1 - i
  }

  // construct the jump table based on the scan offset which mismatch occurs
  let offsetTable = new Array(pl)
  for (let i = pl - 1, last = pl; i >= 0; i--) {
    if (isPrefix(pat, i + 1)) {
      last = i + 1
    }
    offsetTable[pl - 1 - i] = pl - 1 - i + last
  }
  for (let i = 0; i < pl; i++) {
    let slen = suffixLength(pat, i)
    offsetTable[slen] = pl - 1 - i + slen
  }

  // whether s[p:end] is also a prefix of s
  function isPrefix (s, p) {
    for (let i = p, j = 0; i < s.length; i++, j++) {
      if (s[i] !== s[j]) {
        return false
      }
    }
    return true
  }

  // returns the maximum length of the substring ends at p and is a suffix
  function suffixLength (s, p) {
    let len = 0
    for (let i = p, j = s.length - 1; i >= 0; i--, j--) {
      if (s[i] !== s[j]) {
        break
      }
      len++
    }
    return len
  }

  // perform the search
  for (let i = pl - 1; i < sl; ) {
    for (let j = pl - 1; pat[j] === str[i]; i--, j--) {
      if (j === 0) {
        return i
      }
    }
    i += Math.max(offsetTable[pl - 1 - j], (str[i] in charTable ? charTable[str[i]] : pl)) // i += pl - j
  }
  return -1
}
