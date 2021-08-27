import User from '@models/User'
import UserRepository from '../repositories/UserRepository'
import { getCustomRepository } from 'typeorm'
import { hash } from 'bcryptjs'
import AppError from '../error/AppError'

interface UserDate {
  name: string,
  password: string,
  email: string,
  avatar?: string,
}

interface UserAvatarData{
  user_id: string
  avatar: string
}
class UserServices {
  private userRepository: UserRepository

  constructor () {
    this.userRepository = getCustomRepository(UserRepository)
  }

  public async Create ({ name, password, email, avatar } : UserDate) : Promise<User> {
    const checkUserExists = await this.userRepository.findOne({
      where: { email }
    })

    if (checkUserExists) {
      throw new AppError('Email address already used')
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

  public async UpdateAvatar ({ user_id, avatar }: UserAvatarData) : Promise<User> {
    const user = await this.userRepository.findOne(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401)
    }

    // deltar avatar se ele existe

    // if (user.avatar) {

    // }

    user.avatar = avatar

    return this.userRepository.save(user)
  }
}

export default UserServices
