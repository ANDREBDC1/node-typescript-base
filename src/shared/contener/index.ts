import { container } from 'tsyringe'

import IMailTemplateProvider from '@providers/emailProvider/templates/IMailTemplateProvider'
import HabdlebrsMailTemplate from '@providers/emailProvider/templates/HabdlebrsMailTemplate'

import IMailProvider from '@providers/emailProvider/IMailProvider'
import SmtpMailProvader from '@providers/emailProvider/SmtpMailProvader'
import IUploadPrivider from '@providers/uploadProvider/IUploadProvider'
import S3StorageProvider from '@providers/uploadProvider/S3StorageProvider'

// injeção template de email
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplatePrivider',
  HabdlebrsMailTemplate

)

// injeção envio de email
container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(SmtpMailProvader)
)

container.registerSingleton<IUploadPrivider>(
  'UploadProvider',
  S3StorageProvider
)
