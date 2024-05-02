const express = require('express')
const cors = require('cors')
const path = require('path')

const { buildResponse, emails, rules, rand } = require('./helpers')

const server = express()

server.use(express.json())

server.use(express.static(path.join(__dirname, '../dist')))

server.use(cors())

server.post('/api/result', async (req, res) => {
  const [status, payload] = await buildResponse(req)
  res.status(status).json(payload)
})

server.get('/users', (req, res) => {
   res.status(200).json([...emails])
  //res.sendFile(path.join(__dirname, '../dist/index.html'))
})


server.get('/rules', (req, res) => {
  res.status(200).json(rules)
})
 // todo: path : '/rand' [0, 8] random number generate
 server.get('/rand', (req, res) => {
  const randomNumber = rand(0, 8); 
  res.status(200).json({ randomNumber });
});
 
 // todo: /randDimention [3, 7] 
 server.get('/randDimension', (req, res) => {
  const randomDimension = rand(3, 7); 
  res.status(200).json({ randomDimension });
});

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.originalUrl} does not exist`,
  })
})

module.exports = server
