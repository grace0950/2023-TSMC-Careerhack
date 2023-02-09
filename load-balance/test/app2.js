const express = require('express')
const app = express()
const port = 3000

app.post('/order', (req, res) => {
  res.send(req.body)
})

app.get('record', (req, res) => {
    res.send(req.body)
  })

app.get('/report', (req, res) => {
  res.send(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})