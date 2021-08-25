import User from '@models/User'
import UserRepository from 'src/repositories/UserRepository'
import { getCustomRepository } from 'typeorm'
import { hash } from 'bcryptjs'

interface UserDate {
  name: string,
  password: string,
  email: string,
  avatar?: string,
}
class UserServices {
  userRepository: UserRepository

  constructor () {
    this.userRepository = getCustomRepository(UserRepository)
  }

  public async Create ({ name, password, email, avatar } : UserDate) : Promise<User> {
    const checkUserExists = await this.userRepository.findOne({
      where: { email }
    })

    if (checkUserExists) {
      throw new Error('Email address already used')
    }

    const hashedPassword = await hash(password, 8)

    const user = this.userRepository.create({
      name,
      password: hashedPassword,
      email,
      avatar
    })

    return await this.userRepository.save(user)
  }
}

export default UserServices
