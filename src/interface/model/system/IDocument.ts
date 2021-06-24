import ITable from '../extends/ITable'

export default abstract class IDocument extends ITable {
  abstract id?: number
  abstract name?: string
  abstract document?: string
  abstract issecure?: boolean
  abstract url?: string
  abstract previewUrl?: string
}
