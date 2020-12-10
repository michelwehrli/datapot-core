import IPhonenumberLine from './IPhonenumberLine'
import IPhonenumberType from './IPhonenumberType'

export default abstract class IPhonenumber {
  abstract id?: number
  abstract number?: string
  abstract type?: IPhonenumberType
  abstract line?: IPhonenumberLine
}
