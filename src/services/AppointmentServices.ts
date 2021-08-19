import Appointment from '@models/Appointment'
import { startOfHour } from 'date-fns'
import AppointmentRepository from 'src/repositories/AppointmentRepository'
import { getCustomRepository } from 'typeorm'

interface Request {
  date: Date,
  provider: string
}

class AppointmentService {
  appointmentRepository: AppointmentRepository
  constructor () {
    this.appointmentRepository = getCustomRepository(AppointmentRepository)
  }

  public async create ({ date, provider } : Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    const appointmentInSameDate = await this.appointmentRepository.findBayDate(appointmentDate)

    if (appointmentInSameDate) {
      throw Error('this appointment is alredy booker')
    }

    const appointment = this.appointmentRepository.create({
      provider,
      date: appointmentDate
    })

    return await this.appointmentRepository.save(appointment)
  }

  public async getAll () : Promise<Appointment[]> {
    return await this.appointmentRepository.find()
  }
}

export default AppointmentService
