const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

app.use(bodyParser.json())

app.post('/order', (req, res) => {
  res.send(JSON.stringify(req.body))
})

app.get('/record', (req, res) => {
  res.send(JSON.stringify(req.query))
})

app.get('/report', (req, res) => {
  res.send(JSON.stringify(req.query))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})