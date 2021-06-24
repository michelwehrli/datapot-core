import {
  Collection,
  Entity,
  LoadStrategy,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import IAddress from '../../interface/model/data/IAddress'
import ICategory from '../../interface/model/data/ICategory'
import ICompany from '../../interface/model/data/ICompany'
import IEmail from '../../interface/model/data/IEmail'
import IPhonenumber from '../../interface/model/data/IPhonenumber'
import ISocialmedia from '../../interface/model/data/ISocialmedia'
import Global from '../../service/Global'
import Address from './Address'
import Category from './Category'
import Contact from './Contact'
import Email from './Email'
import Table from './parents/Table'
import Phonenumber from './Phonenumber'
import Relationship from './Relationship'
import RWStatus from './RWStatus'
import Socialmedia from './Socialmedia'

@Entity()
export default class Company extends Table {
  @PrimaryKey()
  id!: number
  @Property()
  name: string
  @Property({ nullable: true })
  remarks?: string
  @Property({ nullable: true })
  websites?: string[]
  @ManyToOne(() => Contact, { eager: true, nullable: true })
  contact_person?: Contact
  @ManyToOne(() => RWStatus, { eager: true, nullable: true })
  rwstatus?: RWStatus
  @ManyToOne(() => Relationship, { eager: true, nullable: true })
  relationship?: Relationship
  @ManyToMany(() => Address, null, { eager: true, nullable: true })
  addresses? = new Collection<Address>(this)
  @ManyToMany(() => Email, null, { eager: true, nullable: true })
  emails? = new Collection<Email>(this)
  @ManyToMany(() => Phonenumber, null, { eager: true, nullable: true })
  phonenumbers? = new Collection<Phonenumber>(this)
  @ManyToMany(() => Socialmedia, null, { eager: true, nullable: true })
  social_medias? = new Collection<Socialmedia>(this)
  @ManyToMany(() => Category, null, { eager: true, nullable: true })
  categories? = new Collection<Category>(this)

  constructor(data: ICompany) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.remarks = data?.remarks
    this.websites = data?.websites
    this.contact_person = (data?.contact_person as Contact) || null
    this.rwstatus = (data?.rwstatus as RWStatus) || null
    this.relationship = (data?.relationship as Relationship) || null
    this.addresses.set(
      (data?.addresses as IAddress[])
        .filter((data) => data)
        .map((data) => new Address(data))
    )
    this.emails.set(
      (data?.emails as IEmail[])
        .filter((data) => data)
        .map((data) => new Email(data))
    )
    this.phonenumbers.set(
      (data?.phonenumbers as IPhonenumber[])
        .filter((data) => data)
        .map((data) => new Phonenumber(data))
    )
    this.social_medias.set(
      (data?.social_medias as ISocialmedia[])
        .filter((data) => data)
        .map((data) => new Socialmedia(data))
    )
    this.categories.set(
      (data?.categories as ICategory[])
        .filter((data) => data)
        .map((data) => new Category(data))
    )
  }

  public async refresh(data: ICompany) {
    this.name = data?.name
    this.remarks = data?.remarks
    this.websites = data?.websites

    this.contact_person
      ? data?.contact_person?.id &&
        (await this.contact_person.refresh(data.contact_person))
      : (this.contact_person = data?.contact_person?.id
          ? (data.contact_person as Contact)
          : null)
    this.rwstatus
      ? data?.rwstatus?.uniquename &&
        (await this.rwstatus.refresh(data.rwstatus))
      : (this.rwstatus = data?.rwstatus?.uniquename
          ? (data.rwstatus as RWStatus)
          : null)
    this.relationship
      ? data?.relationship?.uniquename &&
        (await this.relationship.refresh(data.relationship))
      : (this.relationship = data?.relationship?.uniquename
          ? (data.relationship as Relationship)
          : null)

    await Global.setFreshCollection<Address, IAddress>(
      this.addresses,
      data?.addresses as IAddress[],
      Address,
      'id'
    )
    await Global.setFreshCollection<Email, IEmail>(
      this.emails,
      data?.emails as IEmail[],
      Email,
      'id'
    )
    await Global.setFreshCollection<Phonenumber, IPhonenumber>(
      this.phonenumbers,
      data?.phonenumbers as IPhonenumber[],
      Phonenumber,
      'id'
    )
    await Global.setFreshCollection<Socialmedia, ISocialmedia>(
      this.social_medias,
      data?.social_medias as ISocialmedia[],
      Socialmedia,
      'id'
    )
    await Global.setFreshCollection<Category, ICategory>(
      this.categories,
      data?.categories as ICategory[],
      Category,
      'uniquename'
    )
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'company',
        title: 'Firma',
        titlePlural: 'Firmen',
        icon: 'far fa-building',
        isListable: true,
        isMain: true,
        parent: 1,
        sort: 'name',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      name: {
        label: 'Name',
        type: 'string',
        required: true,
      },
      addresses: {
        label: 'Adressen',
        multiple: true,
        type: Address.getDatamodel(),
      },
      emails: {
        label: 'Email-Adressen',
        multiple: true,
        type: Email.getDatamodel(),
      },
      phonenumbers: {
        label: 'Telefonnummern',
        multiple: true,
        type: Phonenumber.getDatamodel(),
      },
      contact_person: {
        label: 'Kontaktperson',
        type: Contact.getDatamodel(true),
      },
      websites: {
        label: 'Webseiten',
        multiple: true,
        type: 'string',
      },
      social_medias: {
        label: 'Socialmedia',
        multiple: true,
        type: Socialmedia.getDatamodel(),
      },
      remarks: {
        label: 'Bemerkungen',
        type: 'string',
      },
      rwstatus: {
        label: 'RW-Status',
        type: RWStatus.getDatamodel(),
      },
      relationship: {
        label: 'Beziehung',
        type: Relationship.getDatamodel(),
      },
      categories: {
        label: 'Kategorien',
        multiple: true,
        type: Category.getDatamodel(),
      },
    })
  }
}
