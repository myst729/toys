void function (win) {
  if (win.__WECALL__) {
    console.warn("[WECALL] Already installed.")
    return
  }

  var highlightMessage = function (msgId) {
    var msg = [...document.querySelectorAll("div.bubble[data-cm]")].find(msg => JSON.parse(msg.dataset.cm).msgId === msgId)
    if (msg) {
      msg.style.border = "1px solid red"
    }
  }

  var indicateState = function () {
    win.__WECALL__ = true
    console.info("[WECALL] Successfully installed.")

    var note = document.createElement("div")
    note.innerHTML = "微<br>信<br>防<br>撤<br>✔"
    note.style.backgroundColor = "yellow"
    note.style.color = "red"
    note.style.fontSize = "64px"
    note.style.fontWeight = "bold"
    note.style.textAlign = "center"
    note.style.padding = "36px"
    note.style.position = "fixed"
    note.style.top = "0"
    note.style.zIndex = "99999"

    var copy = note.cloneNode(true)
    note.style.left = copy.style.right = "-200px"
    note.style.transition = "left 1s ease-in-out"
    copy.style.transition = "right 1s ease-in-out"
    document.body.appendChild(note)
    document.body.appendChild(copy)

    setTimeout(() => {
      copy.style.right = note.style.left = "0"
    }, 100)
  }

  var s = document.createElement("script")
  s.async = true
  s.type = "text/javascript"
  s.src = "https://unpkg.com/xceptor@0.4.0/xceptor.js"

  s.onload = () => {
    XCeptor.post(/\/webwxsync/, () => {}, (req, res) => {
      var body = JSON.parse(res.responseText)
      body.AddMsgList.forEach(msg => {
        if (msg.MsgType === 10002) {
          highlightMessage(msg.Content.match(/&lt;msgid&gt;(\d+)&lt;\/msgid&gt;/)[1])
          msg.MsgType = 10000
          msg.Content = "防撤回啦～"
        }
      })
      res.response = res.responseText = JSON.stringify(body)
    })

    XCeptor.post(/\/webwxrevokemsg/, () => {}, (req, res) => {
      res.response = res.responseText = '{"BaseResponse":{"Ret":1}}'
    })

    indicateState()
  }

  document.body.appendChild(s)
}(this)
