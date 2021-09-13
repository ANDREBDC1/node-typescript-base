import { Router } from 'express'
import UserServices from '@services/UserServices'
import { verifyAuth } from 'src/middlewares/auth'
import { upload } from '../middlewares/upload'
import { container } from 'tsyringe'

const UsersRouter = Router()

UsersRouter.post('/', async (request, response) => {
  const userServices = container.resolve(UserServices)
  const {
    name,
    email,
    password,
    roles

  } = request.body

  const user = await userServices.create({
    name,
    email,
    password,
    roles
  })

  delete user.password

  return response.json(user).status(200)
})

UsersRouter.post('/forgotpassword', async (request, response) => {
  const userServices = container.resolve(UserServices)
  const {
    email

  } = request.body

  const resut = await userServices.forgotPassword(email)

  return response.json({ success: resut }).status(200)
})

UsersRouter.post('/resetpassword', async (request, response) => {
  const userServices = container.resolve(UserServices)
  const {
    token,
    password

  } = request.body

  const resut = await userServices.resetPassword({ token, new_password: password })

  return response.json({ success: resut }).status(200)
})

UsersRouter.patch('/avatar',
  verifyAuth(null),
  upload.single('avatar'),
  async (request, response) => {
    const userServices = container.resolve(UserServices)
    const { filename, mimetype } = request.file

    const user = await userServices.updateAvatar({
      user_id: request.user.id,
      file_name: filename,
      mime_type: mimetype
    })

    delete user.password

    return response.status(200).json(user)
  })

export default UsersRouter
