import Address from '../model/data/Address'
import Category from '../model/data/Category'
import Company from '../model/data/Company'
import CompanyWithLocation from '../model/data/CompanyWithLocation'
import Contact from '../model/data/Contact'
import Country from '../model/data/Country'
import County from '../model/data/County'
import Email from '../model/data/Email'
import EmailType from '../model/data/EmailType'
import Gender from '../model/data/Gender'
import Phonenumber from '../model/data/Phonenumber'
import PhonenumberLine from '../model/data/PhonenumberLine'
import PhonenumberType from '../model/data/PhonenumberType'
import Relationship from '../model/data/Relationship'
import RWStatus from '../model/data/RWStatus'
import Salutation from '../model/data/Salutation'
import Socialmedia from '../model/data/Socialmedia'
import SocialmediaType from '../model/data/SocialmediaType'
import Title from '../model/data/Title'
import Zip from '../model/data/Zip'
import Design from '../model/system/Design'
import Document from '../model/system/Document'
import User from '../model/system/User'

export const ETypeMatch = {
  address: Address,
  category: Category,
  company: Company,
  contact: Contact,
  country: Country,
  county: County,
  email: Email,
  email_type: EmailType,
  gender: Gender,
  phonenumber: Phonenumber,
  phonenumber_line: PhonenumberLine,
  phonenumber_type: PhonenumberType,
  relationship: Relationship,
  rwstatus: RWStatus,
  salutation: Salutation,
  socialmedia: Socialmedia,
  socialmedia_type: SocialmediaType,
  title: Title,
  zip: Zip,
  companyWithLocation: CompanyWithLocation,

  design: Design,
  document: Document,
  user: User,
}
