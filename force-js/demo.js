require(['modules/dom', 'modules/xhr'], function(dom, xhr) {

  xhr.get('demo.json', data => {
    let node = dom.byId('node')
    dom.addClass(node, 'rainbow')
    dom.appendAll(node, data.map(d => {
      let div = dom.create('div')
      dom.text(div, d.letter)
      dom.addClass(div, 'cell')
      dom.addStyle(div, { background: d.bg })
      return div
    }))
  })

})
