import 'reflect-metadata'
import express,
{
  Request,
  Response,
  NextFunction
} from 'express'

import 'express-async-errors'
import cors from 'cors'
import './database'
import './shared/contener'
import routes from './routes'
import AppError from './error/AppError'
import { diretory } from './middlewares/upload'
import { config } from 'dotenv'
config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(diretory))
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.use((err : Error, request : Request, response : Response, next : NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: `Internal server error: [${err.message}]`
  })
})

const server = app.listen(process.env.PORT || 3333, () => {
  const { port, address } = server.address()

  console.log('Example app listening at http://%s:%s', address, port)
})
