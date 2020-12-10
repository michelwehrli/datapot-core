import IDocument from '../system/IDocument'

export default abstract class IEmployee {
  abstract id: number
  abstract uniquename: string
  abstract name: string
  abstract role: string
  abstract titles: string[]
  abstract xing_link: string
  abstract linkedin_link: string
  abstract description: string
  abstract image: IDocument
  abstract cv: IDocument
  abstract career_title: string
  abstract career_company: string
  abstract career_period: string
}
