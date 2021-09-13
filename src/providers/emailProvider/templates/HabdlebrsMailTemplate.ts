import handlebars from 'handlebars'
import IMailTemplateProvider from './IMailTemplateProvider'
import IParseTemplateEmailDto from './IParseTemplateEmailDto'
import path from 'path'
import fs from 'fs'

class HabdlebrsMailTemplate implements IMailTemplateProvider {
  public async paser ({ template_name, variables }: IParseTemplateEmailDto): Promise<string> {
    const diretoryTemplates = path.resolve(__dirname, 'views')
    const pathTemplate = path.join(diretoryTemplates, template_name)

    const tempateExist = await fs.existsSync(pathTemplate)

    if (!tempateExist) {
      throw new Error(`Template ${template_name} not exist.`)
    }

    const teplateFileContent = await fs.readFileSync(pathTemplate, { encoding: 'UTF-8' })

    const parseTemplate = handlebars.compile(teplateFileContent)

    return parseTemplate(variables)
  }
}

export default HabdlebrsMailTemplate
