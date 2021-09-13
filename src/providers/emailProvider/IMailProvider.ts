import ISendMailDto from './ISendMailDto'
export default interface IMailProvider {
  sendEmail(data : ISendMailDto) : Promise<boolean>
}
