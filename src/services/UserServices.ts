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
import UploadFileService from './UploadFileService'
import { injectable, inject, container } from 'tsyringe'
import IMailProvider from '@providers/emailProvider/IMailProvider'

interface UserData {
  name: string,
  password: string,
  email: string,
  avatar?: string,
  roles?: Array<string>
}

interface UserAvatarData{
  user_id: string
  file_name: string,
  mime_type?: string
}

interface UserResetPasswordData {
  token: string
  new_password: string
}

@injectable()
class UserServices {
  private userRepository: UserRepository
  private uploadFileService : UploadFileService

  constructor (
    @inject('MailProvider')
    private mailProvider : IMailProvider

  ) {
    this.userRepository = getCustomRepository(UserRepository)
    this.uploadFileService = container.resolve(UploadFileService)
  }

  public async create ({ name, password, email, avatar, roles } : UserData) : Promise<User> {
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

  public async updateAvatar ({ user_id, file_name, mime_type }: UserAvatarData) : Promise<User> {
    const user = await this.userRepository.findOne(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401)
    }
    // deltar avatar se ele existe

    if (user.avatar) {
      await this.uploadFileService.delete(user.avatar)
    }

    user.avatar = await this.uploadFileService.salve({ file_name, mime_type })

    return this.userRepository.save(user)
  }

  public async getById (user_id : string) : Promise<User> {
    return await this.userRepository.findOne(user_id, { relations: ['permissions'] })
  }

  public async forgotPassword (email : string) : Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new AppError('user not found')
    }

    try {
      // enviar o email para usuário

      const token = crypto.randomBytes(10).toString('HEX')
      const dataExpired = new Date()
      dataExpired.setHours(dataExpired.getHours() + 2)

      const urlResetPassword = `${process.env.URL_FRONT}/reset?token=${token}`
      const send = await this.mailProvider.sendEmail({
        to: {
          name: user.name,
          email: user.email
        },
        subject: 'Recuperação de senha',
        template_data: {
          template_name: 'forgot_password.hbs',
          variables: {
            name: user.name,
            link: urlResetPassword
          }
        }
      })

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

  public async resetPassword ({ token, new_password } : UserResetPasswordData) : Promise<boolean > {
    const user = await this.userRepository.findOne({ where: { token_reset: token } })

    if (!user) {
      throw new AppError('token invalid')
    }

    const dataNow = new Date()

    if (dataNow > user.token_expired) {
      throw new AppError('token expired')
    }

    user.password = await hash(new_password, 8)
    user.token_reset = null
    user.token_expired = null

    await this.userRepository.save(user)

    return true
  }
}

export default UserServices
