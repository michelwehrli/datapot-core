import ITable from '../extends/ITable'

export default abstract class IZip extends ITable {
  abstract id?: number
  abstract zip?: string
  abstract location?: string
}
