import AppointmentService from '@services/AppointmentServices'
import { parseISO } from 'date-fns'
import { Router } from 'express'

const AppointmentsRouter = Router()

AppointmentsRouter.get('/', async (request, response) => {
  const appointmentService = new AppointmentService()
  const appointments = await appointmentService.getAll()

  return response.json(appointments).status(200)
})

AppointmentsRouter.post('/', async (request, response) => {
  try {
    const appointmentService = new AppointmentService()
    const { provider_id, date } = request.body

    const parseDate = parseISO(date)

    const appointment = await appointmentService.create({ date: parseDate, provider_id })

    return response.json(appointment).status(200)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

export default AppointmentsRouter
