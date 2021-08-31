import Permission from '@models/Permission'
import { Router } from 'express'
import { verifyAuth } from 'src/middlewares/auth'
import { getRepository } from 'typeorm'
const PermissionRouter = Router()

PermissionRouter.get('/', verifyAuth(null), async (request, response) => {
  const permissionRepository = getRepository(Permission)

  const permissions = await permissionRepository.find()

  response.status(200).json(permissions)
})

PermissionRouter.post('/', verifyAuth(['admin']), async (request, response) => {
  const permissionRepository = getRepository(Permission)

  const { descript } = request.body

  const permission = permissionRepository.create({ descript })

  const permissions = await permissionRepository.save(permission)

  response.status(200).json(permissions)
})

export default PermissionRouter
