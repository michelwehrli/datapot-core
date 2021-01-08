import { Collection } from '@mikro-orm/core'
import Address from '../../../model/data/Address'
import Category from '../../../model/data/Category'
import CompanyWithLocation from '../../../model/data/CompanyWithLocation'
import Email from '../../../model/data/Email'
import Phonenumber from '../../../model/data/Phonenumber'
import Socialmedia from '../../../model/data/Socialmedia'
import IAddress from './IAddress'
import ICategory from './ICategory'
import ICompanyWithLocation from './ICompanyWithLocation'
import IEmail from './IEmail'
import IGender from './IGender'
import IPhonenumber from './IPhonenumber'
import IRelationship from './IRelationship'
import IRWStatus from './IRWStatus'
import ISalutation from './ISalutation'
import ISocialmedia from './ISocialmedia'
import ITitle from './ITitle'

export default abstract class IContact {
  abstract id?: number
  abstract gender?: IGender
  abstract salutation?: ISalutation
  abstract title?: ITitle
  abstract givenname?: string
  abstract additional_names?: string[]
  abstract surname?: string
  abstract addresses?: Collection<Address> | IAddress[]
  abstract companiesWithLocation?:
    | Collection<CompanyWithLocation>
    | ICompanyWithLocation[]
  abstract department?: string
  abstract positions?: string[]
  abstract phonenumbers?: Collection<Phonenumber> | IPhonenumber[]
  abstract emails?: Collection<Email> | IEmail[]
  abstract birthdate?: number
  abstract partner?: IContact
  abstract websites?: string[]
  abstract social_medias?: Collection<Socialmedia> | ISocialmedia[]
  abstract remarks?: string
  abstract rwstatus?: IRWStatus
  abstract relationship?: IRelationship
  abstract categories?: Collection<Category> | ICategory[]
}
