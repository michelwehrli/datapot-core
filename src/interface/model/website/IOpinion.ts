import ICustomer from './ICustomer'

export default abstract class IOpinion {
  abstract id: number
  abstract customer: ICustomer
  abstract opinion: string
}
