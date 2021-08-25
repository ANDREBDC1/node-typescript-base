import {
  NextFunction,
  Request,
  Response
} from 'express'

import { verify } from 'jsonwebtoken'

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
    throw new Error('JWT token is missing')
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    throw new Error('JWT token is missing')
  }

  try {
    const decode = verify(token, process.env.SECRET)

    const { sub } = decode as TokenPayload

    request.user = {
      id: sub
    }

    return next()
  } catch {
    throw new Error('Invalid JWT token')
  }
}
