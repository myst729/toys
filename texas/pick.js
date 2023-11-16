// Suit Value Table
// ===========================================
// (9 00 00 00 00 00) Royal Flush     皇家同花顺
// (8 00 00 00 00 00) Straight Flush  同花顺
// (7 00 00 00 00 00) Four of a Kind  四条
// (6 00 00 00 00 00) Full House      葫芦
// (5 00 00 00 00 00) Flush           同花
// (4 00 00 00 00 00) Straight        顺子
// (3 00 00 00 00 00) Three of a Kind 三条
// (2 00 00 00 00 00) Two Pairs       两对
// (1 00 00 00 00 00) One Pair        一对
// (0 00 00 00 00 00) Highcard        高牌

function hashPoints (cards) {
  return cards.reduce((result, card) => {
    result[card[1]] = (result[card[1]] || 0) + 1
    return result
  }, {})
}

function hashSuits (cards) {
  return cards.reduce((result, card) => {
    result[card[0]] = true
    return result
  }, {})
}

// (Grade 9) Royal Flush 皇家同花顺
// (Grade 8) Straight Flush 同花顺
function detectStraightFlush (cards) {
  let straight = detectStraight(cards)

  if (straight && detectFlush(cards)) {
    let grade = 0
    let score = 0

    if (straight.score % 100 === 10) {
      // Royal Flush 皇家同花顺
      grade = 9
      score = straight.score + 5 * Math.pow(100, 5)
    } else {
      // Straight Flush 同花顺
      grade = 8
      score = straight.score + 4 * Math.pow(100, 5)
    }
    return { best: cards, grade, score, extra: 5 - cards[0][0] }
  }

  return null
}

// (Grade 7) Four of a Kind 四条
function detectFour (cards) {
  let hash = hashPoints(cards)
  let four = []
  let single = []

  Object.keys(hash).forEach(function (point) {
    if (hash[point] === 4) {
      four.push(+point)
    }
    if (hash[point] === 1) {
      single.push(+point)
    }
  })

  if (four.length === 1) {
    let score = 7 * Math.pow(100, 5) + four[0] * Math.pow(100, 4) + single[0]
    return { best: cards, grade: 7, score, extra: 0 }
  }

  return null
}

// (Grade 6) Full House 葫芦
function detectFullhouse(cards) {
  let hash = hashPoints(cards)
  let triple = []
  let double = []

  Object.keys(hash).forEach(function (point) {
    if (hash[point] === 3) {
      triple.push(+point)
    }
    if (hash[point] === 2) {
      double.push(+point)
    }
  })

  if (triple.length === 1 && double.length === 1) {
    let score = 6 * Math.pow(100, 5) + triple[0] * Math.pow(100, 4) + double[0] * Math.pow(100, 3)
    return { best: cards, grade: 6, score, extra: 0 }
  }

  return null
}

// (Grade 5) Flush 同花
function detectFlush (cards) {
  let hash = hashSuits(cards)
  let single = cards.map(card => card[1]).sort((a, b) => a - b)
  let score = 5 * Math.pow(100, 5)

  if (Object.keys(hash).length === 1) {
    single.forEach(function (point, i) {
      score += point * Math.pow(100, i)
    })
    return { best: cards, grade: 5, score, extra: 5 - cards[0][0] }
  }

  return null
}

// (Grade 4) Straight 顺子
function detectStraight (cards) {
  let single = [...cards]

  // use Ace (14) as 1
  if (single[0][1] === 2 && single[4][1] === 14) {
    single.unshift([single[4][0], 1])
    single.pop()
  }

  for (let i = 1; i < single.length; i++) {
    if (single[i][1] - single[i - 1][1] !== 1) {
      return null
    }
  }
  cards = single
  return { best: cards, grade: 4, score: 4 * Math.pow(100, 5) + single[0][1], extra: 5 - single[4][0] }
}

// (Grade 3) Three of a Kind 三条
// (Grade 2) Two Pairs 两对
// (Grade 1) One Pair 一对
// (Grade 0) Highcard 高牌
function detectLowValues (cards) {
  let hash = hashPoints(cards)
  let triple = []
  let double = []
  let single = []
  let grade = 0
  let score = 0
  let extra = 0

  Object.keys(hash).forEach(function (point) {
    if (hash[point] === 3) {
      triple.push(+point)
    }
    if (hash[point] === 2) {
      double.push(+point)
    }
    if (hash[point] === 1) {
      single.push(+point)
    }
  })

  if (triple.length === 1) {
    // Three of a Kind 三条
    grade = 3
    score = 3 * Math.pow(100, 5) + triple[0] * Math.pow(100, 4)
  }

  if (double.length === 2) {
    grade = 2
    score = 2 * Math.pow(100, 5)
    double.sort((a, b) => a - b).forEach((point, i) => {
      if (i === 1) {
        let suits = cards.filter(card => card[1] === point).map(card => card[0])
        extra = 5 - Math.min(...suits)
      }
      return score += point * Math.pow(100, i + 3)
    })
  }
  if (double.length === 1) {
    grade = 1
    score = Math.pow(100, 5) + double[0] * Math.pow(100, 4)
    let suits = cards.filter(card => card[1] === double[0]).map(card => card[0])
    extra = 5 - Math.min(...suits)
  }

  single.sort((a, b) => a - b).forEach((point, i) => {
    if (i === 4) {
      let suits = cards.filter(card => card[1] === point).map(card => card[0])
      extra = 5 - suits[0]
    }
    return score += point * Math.pow(100, i)
  })
  
  return { best: cards, grade, score, extra }
}

function detectValue (cards) {
  cards.sort((a, b) => (a[1] - b[1]) || (a[0] - b[0]))
  return detectStraightFlush(cards) || detectFour(cards) || detectFullhouse(cards) || detectFlush(cards) || detectStraight(cards) || detectLowValues(cards)
}

// List all possible combinations out of existing collection
// For this game, C(7, 5) = 21
function getCombinations (collection, count) {
  if (count >= collection.length) {
    return [collection]
  }

  let all = []

  void function recursion (arr, size, result) {
    for (let i = 0; i < arr.length; i++) {
      let newResult = [...result, arr[i]]

      if (size === 1) {
        all.push(newResult)
      } else {
        let newArr = [...arr].slice(i + 1)
        recursion(newArr, size - 1, newResult)
      }
    }
  }(collection, count, [])

  return all
}

// Pick 5 cards out of 7 with the largest value
export default function pick (cards) {
  let combinations = getCombinations(cards, 5)
  let best = { score: -1 }
  let current

  for (let i = 0; i < combinations.length; i++) {
    current = detectValue(combinations[i])

    if (current.grade === 9) {
      // Royal Flush
      return { cards, ...current }
    }

    if (current.score > best.score) {
      best = current
    }
  }

  return { cards, ...best }
}
