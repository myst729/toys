import { names, suits, points } from './poker.js'

function humanizeCard ([s, p]) {
  return `${suits[s]} ${points[p]}`
}

export default function humanize ({ cards, best, grade, score }) {
  return {
    cards: cards.map(humanizeCard),
    best: best.map(humanizeCard),
    name: names[grade],
    score
  }
}
