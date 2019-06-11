var HEIGHT = 40
var WIDTH = 60
var SIDE = 12
var world = document.getElementById('world')
var extremes = {from: null, to: null}
var dragging = false
var worldMap = []
var cells

async function sleep (t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t)
  })
}

async function drawSteps(path) {
  if(path) {
    for(var i = 0, l = path.length; i < l; i++) {
      var step = path[i]
      cells[WIDTH * step.y + step.x].className = 'step'
      await sleep(10)
    }
  }
}

function drawPath() {
  [...world.querySelectorAll('.step')].forEach(function(step) {
    step.className = ''
  })

  var from = { x: extremes.from.x, y: extremes.from.y }
  var to = { x: extremes.to.x, y: extremes.to.y }
  var path = aStarSearch(from, to, worldMap)
  drawSteps(path)
}

function constructMap() {
  var fragment = document.createDocumentFragment()
  for(var i = 0; i < HEIGHT; i++) {
    worldMap[i] = []
    for(var j = 0; j < WIDTH; j++) {
      var cell = document.createElement('span')
      cell.x = j
      cell.y = i
      cell.style.height = cell.style.width = (SIDE - 1) + 'px'
      cell.style.top = i * SIDE + 'px'
      cell.style.left = j * SIDE + 'px'
      worldMap[i][j] = { x: j, y: i, walkable: true }
      fragment.appendChild(cell)
    }
  }
  world.appendChild(fragment)
  world.style.height = HEIGHT * SIDE - 1 + 'px'
  world.style.width = WIDTH * SIDE - 1 + 'px'
  cells = world.children
}

function inspectMouse() {
  world.addEventListener('mousedown', function(e) {
    if(e.button === 0 && e.target.tagName === 'SPAN') {
      dragging = true
    }
  }, false)

  document.addEventListener('mouseup', function(e) {
    if(e.button === 0) {
      dragging = false
    }
  }, false)

  world.addEventListener('mousemove', function(e) {
    var target = e.target
    if(dragging && e.button === 0 && target.tagName === 'SPAN' && target.className !== 'from' && target.className !== 'to') {
      target.className = 'obstacle'
      worldMap[target.y][target.x].walkable = false
    }
  }, false)

  world.addEventListener('contextmenu', function(e) {
    e.preventDefault()
    var target = e.target
    if(target.tagName === 'SPAN') {
      worldMap[target.y][target.x].walkable = true
      if(extremes.from === null) {
        target.className = 'from'
        extremes.from = target
      } else {
        if(extremes.to === null) {
          target.className = 'to'
          extremes.to = target
        } else {
          extremes.from.classList.remove('from')
          extremes.to.className = 'from'
          target.className = 'to'
          extremes.from = extremes.to
          extremes.to = target
        }

        drawPath()
      }
    }
    return false
  }, false)
}

constructMap()
inspectMouse()
