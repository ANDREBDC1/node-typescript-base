import Appointment from '@models/Appointment'
import { startOfHour } from 'date-fns'
import AppointmentRepository from 'src/repositories/AppointmentRepository'
import { getCustomRepository } from 'typeorm'
import AppError from '../error/AppError'

interface Request {
  date: Date,
  provider_id: string
}

class AppointmentService {
  private appointmentRepository: AppointmentRepository
  constructor () {
    this.appointmentRepository = getCustomRepository(AppointmentRepository)
  }

  public async create ({ date, provider_id } : Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    const appointmentInSameDate = await this.appointmentRepository.findBayDate(appointmentDate)

    if (appointmentInSameDate) {
      throw new AppError('this appointment is alredy booker')
    }

    const appointment = this.appointmentRepository.create({
      provider_id,
      date: appointmentDate
    })

    return await this.appointmentRepository.save(appointment)
  }

  public async getAll () : Promise<Appointment[]> {
    return await this.appointmentRepository.find()
  }
}

export default AppointmentService
