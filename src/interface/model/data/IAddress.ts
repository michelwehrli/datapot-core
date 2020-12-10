import ICountry from './ICountry'
import ICounty from './ICounty'
import IZip from './IZip'

export default abstract class IAddress {
  abstract id?: number
  abstract street?: string
  abstract pobox?: string
  abstract zip?: IZip
  abstract county?: ICounty
  abstract country?: ICountry
}
