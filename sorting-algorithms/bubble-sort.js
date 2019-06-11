function bubbleSort (list) {
  for (let i = 1; i < list.length; i++) {
    for (let j = i; j > 0; j--) {
      if (list[j] >= list[j-1]) {
        break
      }
      let tmp = list[j]
      list[j] = list[j-1]
      list[j-1] = tmp
    }
  }
  return list
}
