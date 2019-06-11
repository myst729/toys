var zoom = 200
var fractal = 'mandelbrot'

var types = document.querySelectorAll('input[type="radio"]')
var iterations = document.querySelector('input[type="range"]')
var label = document.querySelector('span')
var button = document.querySelector('button')
var canvas = document.querySelector('canvas')
var context = canvas.getContext('2d')

var iterators = (function() {
  // f(z) = z^2 + c
  function mandelbrot (zr, zi, cr, ci, iteration, max) {
    if ((iteration >= max) || (zr * zr + zi * zi > 4)) {
      return iteration
    }
    return mandelbrot(zr * zr - zi * zi + cr, zr * zi * 2 + ci, cr, ci, iteration + 1, max)
  }

  // f(z) = z^2 + c
  function julia (zr, zi, cr, ci, iteration, max) {
    if ((iteration >= max) || (zr * zr + zi * zi > 4)) {
      return iteration
    }
    return julia(zr * zr - zi * zi + cr, zr * zi * 2 + ci, cr, ci, iteration + 1, max)
  }

  // f(z) = z^3 + c
  function juliaTriple (zr, zi, cr, ci, iteration, max) {
    if ((iteration >= max) || (zr * zr + zi * zi > 4)) {
      return iteration
    }
    return juliaTriple(zr * zr * zr - zr * zi * zi * 3 + cr, zr * zr * zi * 3 - zi * zi * zi + ci, cr, ci, iteration + 1, max)
  }

  return {
    mandelbrot: (x, y, max) => mandelbrot(0, 0, x - 2.4, y - 1.5, 1, max),
    julia: (x, y, max) => julia(x - 1.85, y - 1.5, -0.7, 0.27, 1, max),
    julia3: (x, y, max) => juliaTriple(x - 1.85, y - 1.5, -0.58, 0.2, 1, max)
  }
})()

function generatePalette (levels) {
  var palette = []
  var red = 16
  var green = 16
  var blue = 20

  for (var i = 0; i < levels; i++) {
    if (i < levels / 3) {
      red += Math.abs(2.5 * 256 / levels)
    } else if (i < levels / 2) {
      green += Math.abs(5.6 * 256 / levels)
    } else if (i < levels) {
      blue += Math.abs(1.8 * 256 / levels)
    }
    palette.push([red, green, blue])
  }
  return palette
}

function generateImageData (iterations) {
  var width = canvas.width
  var height = canvas.height
  var palette = generatePalette(iterations)
  var imageData = context.createImageData(width, height)
  var result
  var index

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      result = iterators[fractal](x / zoom, y / zoom, iterations)
      index = (y * width + x) * 4
      imageData.data[index] = palette[result - 1][0]
      imageData.data[index + 1] = palette[result - 1][1]
      imageData.data[index + 2] = palette[result - 1][2]
      imageData.data[index + 3] = 255
    }
  }
  return imageData
}

function drawImage () {
  var imageData = generateImageData(+iterations.value)
  context.putImageData(imageData, 0, 0)
}

[...types].forEach(function (type) {
  type.addEventListener('change', function () {
    if (type.checked) {
      fractal = type.value
    }
  }, false)
})

iterations.addEventListener('input', function () {
  label.textContent = iterations.value
}, false)

button.addEventListener('click', drawImage, false)

drawImage()