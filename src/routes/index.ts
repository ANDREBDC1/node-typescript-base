import { Router } from 'express'
import { verifyAuth } from '../middlewares/auth'
import AppointmentsRouter from './Appointment.routes'
import SessionsRouter from './Sessions.routes'
import UsersRouter from './Users.routes'
import PermissionRouter from './Permission.routes'

const routes = Router()

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello World' })
})

routes.use('/appointments', verifyAuth(['admin', 'user']), AppointmentsRouter)
routes.use('/users', UsersRouter)
routes.use('/sessions', SessionsRouter)
routes.use('/permissions', PermissionRouter)

export default routes
