import IDocument from '../system/IDocument'

export default abstract class IOrganization {
  abstract id: number
  abstract name: string
  abstract image: IDocument
}
