import IDocument from '../system/IDocument'
import IEmployee from './IEmployee'

export default abstract class ICustomer {
  abstract id: number
  abstract name: string
  abstract employees: IEmployee[]
  abstract image: IDocument
  abstract link: string
  abstract sort: number
}
