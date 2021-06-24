import ITable from './ITable'

export default abstract class IUniquenameLabel extends ITable {
  abstract uniquename?: string
  abstract label?: string
}
