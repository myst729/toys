function merge (left, right) {
  let list = []

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      list.push(left.shift())
    } else {
      list.push(right.shift())
    }
  }

  return [...list, ...left, ...right]
}

function mergeSortIteration (list) {
  let len = list.length

  if (len > 1) {
    let work = []

    for (let i = 0; i < len; i++) {
      work.push([list[i]])
    }
    work.push([])

    for (let j = len, k; j > 1; j = Math.ceil(j/2)) {
      for (k = 0, l = 0; l < j; k++, l += 2) {
        work[k] = merge(work[l], work[l+1])
      }
      work[k] = []
    }
    return work[0]
  } else {
    return list
  }
}
