import IDocument from '../system/IDocument'

export default abstract class IService {
  abstract id: number
  abstract uniquename: string
  abstract title: string
  abstract sort: string
  abstract image: IDocument
  abstract we_offer: string
  abstract we_do: string
}
