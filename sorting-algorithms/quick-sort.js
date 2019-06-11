function quickSort (arr) {
  if (arr.length < 2) {
    return arr
  }

  let pivot = arr[0]
  let less = []
  let greater = []

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      less.push(arr[i])
    } else {
      greater.push(arr[i])
    }
  }
  return [...quickSort(less), pivot, ...quickSort(greater)]
}
