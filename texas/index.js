import deck from './poker.js'
import shuffle from './shuffle.js'
import pick from './pick.js'
import humanize from './humanize.js'

console.log(humanize(pick(shuffle(3, ...deck).slice(0, 7))))
