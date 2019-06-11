function partition (list, start, end) {
  let index = start
  let pivot = list[start]
  let tmp

  list[start] = list[end]
  list[end] = pivot

  for (let i = start; i < end; i++) {
    if (list[i] < pivot) {
      tmp = list[index]
      list[index] = list[i]
      list[i] = tmp
      index++
    }
  }
  list[end] = list[index]
  list[index] = pivot
  return index
}

function quickSortInPlace (list, start, end) {
  let left = start || 0
  let right = typeof end === 'number' ? end : list.length - 1
  if (right > left) {
    let index = partition(list, left, right)
    quickSortInPlace(list, left, index - 1)
    quickSortInPlace(list, index + 1, right)
  }
  return list
}
