import express from 'express'
import './database'
import 'reflect-metadata'
import { config } from 'dotenv'
import routes from './routes'
config()

const app = express()

app.use(express.json())

app.use(routes)

const server = app.listen(3333, () => {
  const { port, address } = server.address()

  console.log('Example app listening at http://%s:%s', address, port)
})
