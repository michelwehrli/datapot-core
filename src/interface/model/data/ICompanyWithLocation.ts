import IAddress from './IAddress'
import ICompany from './ICompany'

export default abstract class ICompanyWithLocation {
  abstract id?: number
  abstract company?: ICompany
  abstract address?: IAddress
}
