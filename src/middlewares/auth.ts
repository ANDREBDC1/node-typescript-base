import UserServices from '@services/UserServices'
import {
  NextFunction,
  Request,
  Response
} from 'express'

import { verify } from 'jsonwebtoken'
import AppError from '../error/AppError'
import { container } from 'tsyringe'

interface TokenPayload{
  ait: number,
  exp: number,
  sub : string,
}

const verifyAuth = (roles : string []) => {
  const ensureAuthenticated = async (
    request : Request,
    response : Response,
    next : NextFunction
  ) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('JWT token is missing', 401)
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new AppError('JWT token is missing', 401)
    }

    const userServices = container.resolve(UserServices)

    try {
      const decode = verify(token, process.env.SECRET)

      const { sub } = decode as TokenPayload

      if (roles) {
        const user = await userServices.getById(sub)

        const roulesUser = user.permissions.map(permission => permission.descript)

        const isPermission = await roles.some(r => roulesUser.includes(r))

        if (!isPermission) {
          throw new AppError('Not autorization', 401)
        }
      }

      request.user = {
        id: sub
      }

      return next()
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Invalid JWT token'
      throw new AppError(message, 401)
    }
  }

  return ensureAuthenticated
}

export { verifyAuth }
