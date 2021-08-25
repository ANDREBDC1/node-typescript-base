import { Router } from 'express'
import UserServices from '@services/UserServices'

const UsersRouter = Router()

UsersRouter.post('/', async (request, response) => {
  try {
    const userServices = new UserServices()
    const {
      name,
      email,
      password
    } = request.body

    const user = await userServices.Create({
      name,
      email,
      password
    })

    delete user.password

    return response.json(user).status(200)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

export default UsersRouter
