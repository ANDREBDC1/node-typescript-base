import UserRepository from '../repositories/UserRepository'
import { getCustomRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import User from '@models/User'
import { sign } from 'jsonwebtoken'
import AppError from '../error/AppError'

interface AuthData {
  email: string,
  password: string
}

interface UserAuthData {
  user: User,
  token: string
}

class AuthenticateUserService {
  private userRepository: UserRepository
  constructor () {
    this.userRepository = getCustomRepository(UserRepository)
  }

  public async auth ({ email, password } : AuthData) : Promise<UserAuthData> {
    const user = await this.userRepository.findOne({
      where: { email }
      // relations: ['permissions']

    })

    if (!user) {
      throw new AppError('Incorret email/password combination', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Incorret email/password combination', 401)
    }

    // const roulesIds = user.permissions.map(p => p.id)
    const token = sign({ }, process.env.SECRET, {
      subject: user.id,
      expiresIn: '1d'
    })

    const data = {
      user,
      token
    }

    return data
  }

  public async refreshToken (user_id: string) : Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: user_id } })

    if (!user) {
      throw new AppError('token invalid')
    }
    const newToken = sign({ }, process.env.SECRET, {
      subject: user.id,
      expiresIn: '1d'
    })

    return newToken
  }
}

export default AuthenticateUserService
