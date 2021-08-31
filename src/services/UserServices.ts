import User from '@models/User'
import UserRepository from '../repositories/UserRepository'
import {
  getCustomRepository,
  getRepository
} from 'typeorm'
import { hash } from 'bcryptjs'
import AppError from '../error/AppError'
import Permission from '@models/Permission'
import crypto from 'crypto'

interface UserDate {
  name: string,
  password: string,
  email: string,
  avatar?: string,
  roles?: Array<string>
}

interface UserAvatarData{
  user_id: string
  avatar: string
}

interface UserResetPasswordData {
  token: string
  newPassword: string
}
class UserServices {
  private userRepository: UserRepository

  constructor () {
    this.userRepository = getCustomRepository(UserRepository)
  }

  public async Create ({ name, password, email, avatar, roles } : UserDate) : Promise<User> {
    const permissionRepository = getRepository(Permission)
    const checkUserExists = await this.userRepository.findOne({
      where: { email }
    })

    if (checkUserExists) {
      throw new AppError('Email address already used')
    }

    const hashedPassword = await hash(password, 8)

    const permissions = await permissionRepository.findByIds(roles)

    if (!permissions) {
      throw new AppError('Permission not exist')
    }

    const user = this.userRepository.create({
      name,
      password: hashedPassword,
      email,
      avatar,
      permissions
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

  public async GetById (user_id : string) : Promise<User> {
    return await this.userRepository.findOne(user_id, { relations: ['permissions'] })
  }

  public async ForgotPassword (email : string) : Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new AppError('user not found')
    }

    try {
      // enviar o email para usuário

      const token = crypto.randomBytes(10).toString('HEX')
      const dataExpired = new Date()
      dataExpired.setHours(2)

      const urlResetPassword = `${process.env.URL_FRONT}/reset?token=${token}`
      const send = true

      if (send) {
        user.token_reset = token
        user.token_expired = dataExpired

        await this.userRepository.save(user)

        return true
      }
    } catch (err) {
      throw new AppError(err.message)
    }
  }

  public async ResetPassword ({ token, newPassword } : UserResetPasswordData) : Promise<boolean > {
    const user = await this.userRepository.findOne({ where: { token_reset: token } })

    if (!user) {
      throw new AppError('token invalid')
    }

    const dataNow = new Date()

    if (user.token_expired > dataNow) {
      throw new AppError('token invalid')
    }

    user.password = await hash(newPassword, 8)
    user.token_reset = null
    user.token_expired = null

    await this.userRepository.save(user)

    return true
  }
}

export default UserServices
