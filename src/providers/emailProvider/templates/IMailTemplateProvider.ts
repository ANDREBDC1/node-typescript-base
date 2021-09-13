import IParseTemplateEmailDto from './IParseTemplateEmailDto'

export default interface IMailTemplateProvider {

  paser(data : IParseTemplateEmailDto): Promise<string>

}
