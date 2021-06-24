import ITable from '../extends/ITable'
import ISocialmediaType from './ISocialmediaType'

export default abstract class ISocialmedia extends ITable {
  abstract id?: number
  abstract url?: string
  abstract type?: ISocialmediaType
}
