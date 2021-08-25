import { Router } from 'express'
import EnsureAuthenticated from 'src/middlewares/ensureAuthenticated'
import AppointmentsRouter from './Appointment.routes'
import SessionsRouter from './Sessions.routes'
import UsersRouter from './Users.routes'

const routes = Router()

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello World' })
})

routes.use('/appointments', EnsureAuthenticated, AppointmentsRouter)
routes.use('/users', UsersRouter)
routes.use('/sessions', SessionsRouter)

export default routes
