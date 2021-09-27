import IParseTemplateEmailDto from './templates/IParseTemplateEmailDto'

interface IMailContact{
  name: string
  email: string
}

export default interface ISendMailDto{

  from?: IMailContact | null,

  to: IMailContact

  subject: string

  template_data: IParseTemplateEmailDto

}
