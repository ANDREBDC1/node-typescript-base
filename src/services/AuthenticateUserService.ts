import UserRepository from 'src/repositories/UserRepository'
import { getCustomRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import User from '@models/User'
import { sign } from 'jsonwebtoken'

interface AuthData {
  email: string,
  password: string,
}

interface UserAuthData {
  user: User,
  token: string
}

class AuthenticateUserService {
  userRepository: UserRepository
  constructor () {
    this.userRepository = getCustomRepository(UserRepository)
  }

  public async auth ({ email, password } : AuthData) : Promise<UserAuthData> {
    const user = await this.userRepository.findOne({
      where: { email }
    })

    if (!user) {
      throw new Error('Incorret email/password combination')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new Error('Incorret email/password combination')
    }

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
}

export default AuthenticateUserService
