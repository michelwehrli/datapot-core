import { Collection } from '@mikro-orm/core'
import Address from '../../../model/data/Address'
import Email from '../../../model/data/Email'
import Phonenumber from '../../../model/data/Phonenumber'
import IAddress from './IAddress'
import IEmail from './IEmail'
import IPhonenumber from './IPhonenumber'

export default abstract class ICompany {
  abstract id?: number
  abstract name?: string
  abstract addresses?: Collection<Address> | IAddress[]
  abstract emails?: Collection<Email> | IEmail[]
  abstract phonenumbers?: Collection<Phonenumber> | IPhonenumber[]
  abstract websites?: string[]
  abstract remarks?: string
}
