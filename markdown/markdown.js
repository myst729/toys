let xss = require('xss')
let marked = require('marked')
let prism = require('prismjs')
let hljs = require('highlight.js')

let filter = new xss.FilterXSS({
  whiteList: Object.assign(xss.whiteList, {
    pre: ['class'],
    code: ['class'],
    span: ['class']
  })
})

let highlighters = {
  prism: (code, lang) => prism.highlight(code, prism.languages[lang], lang),
  hljs: (code, lang) => hljs.highlight(lang, code).value
}

let getHighlighter = type => {
  if (typeof highlighters[type] !== 'function') {
    return null
  }

  return (code, lang) => {
    if (lang) {
      try {
        return highlighters[type](code, lang)
      } catch (e) {
        return code
      }
    }
    return code
  }
}

let parse = ({text, highlight}) => {
  marked.setOptions({
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    highlight: getHighlighter(highlight)
  })

  return filter.process(marked(text))
}

module.exports = parse
