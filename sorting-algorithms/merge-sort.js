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

function mergeSort (list) {
  if (list.length < 2) {
    return list
  }

  let index = Math.floor(list.length/2)
  let left = list.slice(0, index)
  let right = list.slice(index)
  return merge(mergeSort(left), mergeSort(right))
}
