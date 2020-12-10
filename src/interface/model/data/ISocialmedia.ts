import ISocialmediaType from './ISocialmediaType'

export default abstract class ISocialmedia {
  abstract id?: number
  abstract url?: string
  abstract type?: ISocialmediaType
}
