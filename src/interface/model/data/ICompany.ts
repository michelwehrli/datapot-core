import { Collection } from '@mikro-orm/core'
import Address from '../../../model/data/Address'
import Email from '../../../model/data/Email'
import Phonenumber from '../../../model/data/Phonenumber'
import IAddress from './IAddress'
import IContact from './IContact'
import IEmail from './IEmail'
import IPhonenumber from './IPhonenumber'

export default abstract class ICompany {
  abstract id?: number
  abstract name?: string
  abstract addresses?: Collection<Address> | IAddress[]
  abstract emails?: Collection<Email> | IEmail[]
  abstract phonenumbers?: Collection<Phonenumber> | IPhonenumber[]
  abstract contact_person?: IContact
  abstract websites?: string[]
  abstract remarks?: string
}
