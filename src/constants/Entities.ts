import { response } from 'express'
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
import Table from '../model/extends/Table'
import CompetenceField from '../model/projectreferences/CompentenceField'
import Complexity from '../model/projectreferences/Complexity'
import Industry from '../model/projectreferences/Industry'
import Projectreference from '../model/projectreferences/Projectreference'
import ResponsibleArea from '../model/projectreferences/ResponsbileArea'
import Role from '../model/projectreferences/Role'
import Design from '../model/system/Design'
import Document from '../model/system/Document'
import User from '../model/system/User'

export const AllEntities = [
  Table,
  Address,
  Category,
  Company,
  Contact,
  Country,
  County,
  Email,
  EmailType,
  Gender,
  Phonenumber,
  PhonenumberType,
  PhonenumberLine,
  Relationship,
  RWStatus,
  Salutation,
  Socialmedia,
  SocialmediaType,
  Title,
  Zip,
  CompanyWithLocation,
  CompetenceField,
  Complexity,
  Industry,
  Projectreference,
  ResponsibleArea,
  Role,
  User,
  Design,
  Document,
]

export const DataEntities = [
  Table,
  Address,
  Category,
  Company,
  Contact,
  Country,
  County,
  Email,
  EmailType,
  Gender,
  Phonenumber,
  PhonenumberType,
  PhonenumberLine,
  Relationship,
  RWStatus,
  Salutation,
  Socialmedia,
  SocialmediaType,
  Title,
  Zip,
  CompanyWithLocation,
]

export const ProjectreferenceEntities = [
  Table,
  CompetenceField,
  Complexity,
  Industry,
  Projectreference,
  ResponsibleArea,
  Role,
]

export const SystemEntities = [Table, User, Design, Document]

export const ProjectEntities = []
