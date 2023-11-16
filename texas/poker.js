export const names = [
  'Highcard',        // 高牌
  'Pair',            // 一对
  'Two Pairs',       // 两对
  'Three of a Kind', // 三条
  'Straight',        // 顺子
  'Flush',           // 同花
  'Full House',      // 葫芦
  'Four of a Kind',  // 四条
  'Straight Flush',  // 同花顺
  'Royal Flush',     // 皇家同花顺
]

export const suits = {
  1: '♠', // Spade
  2: '♥', // Heart
  3: '♣', // Club
  4: '♦'  // Diamond
}

export const points = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
}

export default Object.keys(suits).flatMap(suit => Object.keys(points).map(point => [+suit, +point]))
