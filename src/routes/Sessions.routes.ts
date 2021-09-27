import { Router } from 'express'
import AuthenticateUserService from '@services/AuthenticateUserService'
import { verifyAuth } from '../middlewares/auth'

const SessionsRouter = Router()

SessionsRouter.post('/', async (request, response) => {
  const {

    email,
    password

  } = request.body

  const authenticateUser = new AuthenticateUserService()

  const { user, token } = await authenticateUser.auth({ email, password })

  delete user.password
  return response.json({ user, token }).status(200)
})

SessionsRouter.get('/refreshToken', verifyAuth(null), async (request, response) => {
  const authenticateUser = new AuthenticateUserService()

  const token = await authenticateUser.refreshToken(request.user.id)

  return response.json({ token }).status(200)
})

export default SessionsRouter
