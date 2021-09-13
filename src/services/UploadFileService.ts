
import { diretory, diretoryTmp } from '../middlewares/upload'
import path from 'path'
import fs from 'fs'
import AppError from '../error/AppError'
import { Boolean } from 'aws-sdk/clients/apigateway'
import { injectable, inject } from 'tsyringe'
import IUploadProvider from '@providers/uploadProvider/IUploadProvider'

interface IUpalodFileData {
  file_name: string
  mime_type?: string
}

@injectable()
class UploadFileService {
  private type_evironmentDev : Boolean
  constructor (
    @inject('UploadProvider')
    private uploadProvider : IUploadProvider
  ) {
    this.type_evironmentDev = JSON.parse(process.env.EVIRONMENT_DEV)
  }

  public async delete (url_file : string) : Promise<void> {
    await this.delteFileLocal(this.getFileNameUrl(url_file))

    await this.uploadProvider.delete(this.getFileNameUrl(url_file))
  }

  private getFileNameUrl (ulr: string) : string {
    const urlFile = ulr.split('/')

    return urlFile[(urlFile.length - 1)]
  }

  public async salve ({ file_name, mime_type } : IUpalodFileData) : Promise<string> {
    await this.moveFile(file_name)
    if (this.type_evironmentDev) {
      return `${process.env.URL_BACK}/files/${file_name}`
    }
    const urlFile = await this.uploadProvider.upload({
      file_path: diretory,
      file_name,
      mime_type
    })

    await this.delteFileLocal(file_name)

    return urlFile
  }

  private async moveFile (file_name: string) {
    await fs.renameSync(path.join(diretoryTmp, file_name), path.join(diretory, file_name))

    return true
  }

  private async delteFileLocal (fileName : string) : Promise<boolean> {
    try {
      // deletar Arquivo local

      const userAvatarFilePath = path.join(diretory, fileName)
      const fileExists = await fs.existsSync(userAvatarFilePath)

      if (fileExists) {
        await fs.unlinkSync(userAvatarFilePath)
      }
      return true
    } catch {
      throw new AppError('failed delete file')
    }
  }
}

export default UploadFileService
