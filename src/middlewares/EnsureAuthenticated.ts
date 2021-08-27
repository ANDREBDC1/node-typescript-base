import {
  NextFunction,
  Request,
  Response
} from 'express'

import { verify } from 'jsonwebtoken'
import AppError from '../error/AppError'

interface TokenPayload{
  ait: number,
  exp: number,
  sub : string
}

export default function EnsureAuthenticated (
  request : Request,
  response : Response,
  next : NextFunction
) : void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401)
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    throw new AppError('JWT token is missing', 401)
  }

  try {
    const decode = verify(token, process.env.SECRET)

    const { sub } = decode as TokenPayload

    request.user = {
      id: sub
    }

    return next()
  } catch {
    throw new AppError('Invalid JWT token', 401)
  }
}
