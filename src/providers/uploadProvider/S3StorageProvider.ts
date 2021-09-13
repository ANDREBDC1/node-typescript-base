import IUploadPrivider from './IUploadProvider'
import Aws from 'aws-sdk'
import AppError from '../../error/AppError'
import fs from 'fs'
import path from 'path'
import IUploadPrividerDto from './IUploadPrividerDto'
const storageS3 = new Aws.S3()

export default class S3StorageProvider implements IUploadPrivider {
  public async delete (file_name: string): Promise<boolean> {
    try {
      await storageS3.deleteObject({
        Key: file_name,
        Bucket: process.env.AWS_BUCKET_NAME

      }).promise()
      return true
    } catch {
      throw new AppError('failed delete file')
    }
  }

  public async upload ({ file_name, file_path, mime_type } : IUploadPrividerDto): Promise<string> {
    try {
      const { Location } = await storageS3.upload({
        Key: file_name,
        ACL: 'public-read',
        Body: fs.readFileSync(path.join(file_path, file_name)),
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: mime_type
      }).promise()

      return Location
    } catch {
      throw new AppError('failed upalod file')
    }
  }
}
