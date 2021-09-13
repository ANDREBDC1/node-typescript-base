
import { injectable, inject } from 'tsyringe'
import IMailProvider from './IMailProvider'
import ISendMailDto from './ISendMailDto'
import nodemailer, { Transporter } from 'nodemailer'
import IMailTemplateProvider from './templates/IMailTemplateProvider'

@injectable()
class SmtpMailProvader implements IMailProvider {
  private cliente : Transporter
  constructor (
    @inject('MailTemplatePrivider')
    private mailTemplateProvider : IMailTemplateProvider
  ) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: JSON.parse(process.env.SMTP_SECURE), // use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }

    })

    this.cliente = transport
  }

  public async sendEmail ({ to, from, subject, template_data }: ISendMailDto) : Promise<boolean> {
    const templatePaser = await this.mailTemplateProvider.paser(template_data)

    const message = await this.cliente.sendMail({
      from: {
        name: from == null ? 'App Teste' : from.name,
        address: from == null ? 'rianbdc1@gmail.com' : from.email

      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: templatePaser
    })

    return true
  }
}

export default SmtpMailProvader
