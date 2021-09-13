
interface IteplateVariables {
  [key : string] : string | number
}

export default interface IParseTemplateEmailDto{

  template_name : string,
  variables: IteplateVariables

}
