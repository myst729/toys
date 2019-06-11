var fs = require('fs')
var http = require('http')
var url = require('url')
var querystring = require('querystring')
var formidable = require('formidable')
var mmm = require('mmmagic')
var Magic = mmm.Magic

var handle = {}
var tmpDir = 'tmp'

handle['/'] = (response, request) => {
  fs.readFile('./client.html', (error, data) => {
    response.end(data)
  })
}

handle['/upload'] = (response, request) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = tmpDir
  form.parse(request, (error, fields, files) => {
    var magic = new Magic(mmm.MAGIC_MIME_TYPE)
    magic.detectFile(files.file.path, (err, result) => {
      var extname = {
        'image/gif': 'gif',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/svg+xml': 'svg'
      }[result]
      var filename = `${fields.rename}.${extname}`
      fs.renameSync(files.file.path, `./${tmpDir}/${filename}`)
      response.end(filename)
    })
  })
}

handle['/image'] = (response, request) => {
  var queries = querystring.parse(url.parse(request.url).query)
  var filepath = `./${tmpDir}/${queries.name}`

  fs.readFile(filepath, 'binary', (error, file) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.write(error)
      response.end()
    } else {
      var magic = new Magic(mmm.MAGIC_MIME_TYPE)
      magic.detectFile(filepath, (err, result) => {
        response.writeHead(200, { 'Content-Type': result })
        response.write(file, 'binary')
        response.end()
      })
    }
  })
}

handle['/404'] = (response, request) => {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.write('404 Not found')
  response.end()
}

http.createServer((request, response) => {
  var pathname = url.parse(request.url).pathname
  var handler = handle[pathname] || handle['/404']
  handler(response, request)
}).listen(8888)
