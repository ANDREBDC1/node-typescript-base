import { Router } from 'express'
import UserServices from '@services/UserServices'

const UsersRouter = Router()

UsersRouter.post('/', async (request, response) => {
  const userServices = new UserServices()
  const {
    name,
    email,
    password,
    roles

  } = request.body

  const user = await userServices.Create({
    name,
    email,
    password,
    roles
  })

  delete user.password

  return response.json(user).status(200)
})

export default UsersRouter
