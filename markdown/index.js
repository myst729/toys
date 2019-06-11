let path = require('path')
let express = require('express')
let bodyParser = require('body-parser')
let parse = require('./markdown')

let port = process.env.PORT || 9008
let app = express()
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('assets'))

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.sendFile(path.resolve('client.html'))
})

app.post('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  let markup = parse(JSON.parse(req.body))
  res.send(markup)
})

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.sendStatus(200)
})

app.listen(port)

if (process.env.NODE_ENV === 'dev') {
  console.log(`\nmarkdown is running at \u001b[1;34mhttp://localhost:${port}\u001b[0;22m\n`)
}
