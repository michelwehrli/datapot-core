import IEmailType from './IEmailType'

export default abstract class IEmail {
  abstract id?: number
  abstract address?: string
  abstract type?: IEmailType
}
