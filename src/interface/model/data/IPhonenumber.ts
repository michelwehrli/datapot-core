import ITable from '../extends/ITable'
import IPhonenumberLine from './IPhonenumberLine'
import IPhonenumberType from './IPhonenumberType'

export default abstract class IPhonenumber extends ITable {
  abstract id?: number
  abstract number?: string
  abstract type?: IPhonenumberType
  abstract line?: IPhonenumberLine
}
