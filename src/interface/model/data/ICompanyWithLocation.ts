import IUniquenameLabel from '../extends/IUniquenameLabel'
import IAddress from './IAddress'
import ICompany from './ICompany'

export default abstract class ICompanyWithLocation extends IUniquenameLabel {
  abstract id?: number
  abstract company?: ICompany
  abstract address?: IAddress
}
