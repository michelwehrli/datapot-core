import ITable from '../extends/ITable'
import IEmailType from './IEmailType'

export default abstract class IEmail extends ITable {
  abstract id?: number
  abstract address?: string
  abstract type?: IEmailType
}
