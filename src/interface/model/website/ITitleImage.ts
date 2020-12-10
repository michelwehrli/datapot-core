import IDocument from '../system/IDocument'

export default abstract class ITitleImage {
  abstract id: number
  abstract page: string
  abstract image: IDocument
}
