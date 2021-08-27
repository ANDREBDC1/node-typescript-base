import { Router } from 'express'
import AuthenticateUserService from '@services/AuthenticateUserService'

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

export default SessionsRouter
