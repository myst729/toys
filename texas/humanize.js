import { names, suits, points } from './poker.js'

function humanizeCard ([suit, point]) {
  return `${suits[suit]} ${points[point]}`
}

export default function humanize ({ cards, best, grade, score, extra }) {
  return {
    cards: cards.map(humanizeCard),
    best: best.map(humanizeCard),
    name: names[grade],
    score,
    extra,
  }
}
