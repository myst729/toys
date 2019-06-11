// Knuth-Morris-Pratt string search algorithm (a.k.a. KMP algorithm)
function kmpSearch (string, pattern) {
  let str = string.split('')
  let pat = pattern.split('')
  let sl = str.length
  let pl = pat.length

  // construct the lookup table
  let t = new Array(pl)
  t[0] = -1
  t[1] = 0
  for (let pos = 2, cnd = 0; pos < pl; ) {
    if (pat[pos - 1] === pat[cnd]) {
      cnd++
      t[pos] = cnd
      pos++
    } else if (cnd > 0) {
      cnd = t[cnd]
    } else {
      t[pos] = 0
      pos++
    }
  }

  // perform the search
  let i = 0
  let j = 0
  while (i + j < sl) {
    if (pat[i] === str[i + j]) {
      i++
      if (i === pl) {
        return j
      }
    } else {
      j = i + j - t[i]
      i = (t[i] > -1) ? t[i] : 0 // i = Math.max(t[i], 0)
    }
  }
  return -1
}
