import ITable from '../extends/ITable'
import ICountry from './ICountry'
import ICounty from './ICounty'
import IZip from './IZip'

export default abstract class IAddress extends ITable {
  abstract id?: number
  abstract street?: string
  abstract additionals?: string
  abstract pobox?: string
  abstract zip?: IZip
  abstract county?: ICounty
  abstract country?: ICountry
}
