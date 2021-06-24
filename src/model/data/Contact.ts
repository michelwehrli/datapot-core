import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import IAddress from '../../interface/model/data/IAddress'
import ICategory from '../../interface/model/data/ICategory'
import ICompanyWithLocation from '../../interface/model/data/ICompanyWithLocation'
import IContact from '../../interface/model/data/IContact'
import IEmail from '../../interface/model/data/IEmail'
import IPhonenumber from '../../interface/model/data/IPhonenumber'
import ISocialmedia from '../../interface/model/data/ISocialmedia'
import Global from '../../service/Global'
import Address from './Address'
import Category from './Category'
import CompanyWithLocation from './CompanyWithLocation'
import Email from './Email'
import Gender from './Gender'
import Table from './parents/Table'
import Phonenumber from './Phonenumber'
import Relationship from './Relationship'
import RWStatus from './RWStatus'
import Salutation from './Salutation'
import Socialmedia from './Socialmedia'
import Title from './Title'

@Entity()
export default class Contact extends Table implements IContact {
  @PrimaryKey()
  id!: number
  @Property()
  surname: string

  @Property({ nullable: true })
  birthdate?: number
  @Property({ nullable: true })
  givenname?: string
  @Property({ nullable: true })
  department?: string
  @Property({ nullable: true })
  remarks: string
  @Property({ nullable: true })
  additional_names?: string[]
  @Property({ nullable: true })
  websites?: string[]
  @Property({ nullable: true })
  positions?: string[]

  @ManyToOne(() => Gender, { eager: true, nullable: true })
  gender?: Gender
  @ManyToOne(() => Salutation, { eager: true, nullable: true })
  salutation?: Salutation
  @ManyToOne(() => Title, { eager: true, nullable: true })
  title?: Title
  @ManyToOne(() => Contact, { eager: true, nullable: true })
  partner?: Contact
  @ManyToOne(() => RWStatus, { eager: true, nullable: true })
  rwstatus?: RWStatus
  @ManyToOne(() => Relationship, { eager: true, nullable: true })
  relationship?: Relationship

  @ManyToMany(() => Address, null, { eager: true, nullable: true })
  addresses? = new Collection<Address>(this)
  @ManyToMany(() => CompanyWithLocation, null, { eager: true, nullable: true })
  companiesWithLocation? = new Collection<CompanyWithLocation>(this)
  @ManyToMany(() => Phonenumber, null, { eager: true, nullable: true })
  phonenumbers? = new Collection<Phonenumber>(this)
  @ManyToMany(() => Email, null, { eager: true, nullable: true })
  emails? = new Collection<Email>(this)
  @ManyToMany(() => Socialmedia, null, { eager: true, nullable: true })
  social_medias? = new Collection<Socialmedia>(this)
  @ManyToMany(() => Category, null, { eager: true, nullable: true })
  categories? = new Collection<Category>(this)

  constructor(data: IContact) {
    super(data)

    this.id = data?.id
    this.birthdate = data?.birthdate
    this.givenname = data?.givenname
    this.surname = data?.surname
    this.department = data?.department
    this.remarks = data?.remarks
    this.additional_names = data?.additional_names
    this.websites = data?.websites
    this.positions = data?.positions

    this.gender = (data?.gender as Gender) || null
    this.salutation = (data?.salutation as Salutation) || null
    this.title = (data?.title as Title) || null
    this.partner = (data?.partner as Contact) || null
    this.rwstatus = (data?.rwstatus as RWStatus) || null
    this.relationship = (data?.relationship as Relationship) || null

    data?.addresses &&
      this.addresses.set(
        (data?.addresses as IAddress[])
          ?.filter((data) => !!data)
          ?.map((data) => data as Address)
      )
    data?.companiesWithLocation &&
      this.companiesWithLocation.set(
        (data?.companiesWithLocation as ICompanyWithLocation[])
          ?.filter((data) => !!data)
          ?.map((data) => data as CompanyWithLocation)
      )
    data?.phonenumbers &&
      this.phonenumbers.set(
        (data?.phonenumbers as IPhonenumber[])
          ?.filter((data) => !!data)
          ?.map((data) => data as Phonenumber)
      )
    data?.emails &&
      this.emails.set(
        (data?.emails as IEmail[])
          ?.filter((data) => !!data)
          ?.map((data) => data as Email)
      )
    data?.social_medias &&
      this.social_medias.set(
        (data?.social_medias as ISocialmedia[])
          ?.filter((data) => !!data)
          ?.map((data) => data as Socialmedia)
      )
    data?.categories &&
      this.categories.set(
        (data?.categories as ICategory[])
          ?.filter((data) => !!data)
          ?.map((data) => data as Category)
      )
  }

  public async refresh(data: IContact) {
    this.birthdate = data?.birthdate
    this.givenname = data?.givenname
    this.surname = data?.surname
    this.department = data?.department
    this.remarks = data?.remarks
    this.additional_names = data?.additional_names
    this.websites = data?.websites
    this.positions = data?.positions

    this.gender
      ? data?.gender?.uniquename && (await this.gender.refresh(data.gender))
      : (this.gender = data?.gender?.uniquename
          ? (data.gender as Gender)
          : null)
    this.salutation
      ? data?.salutation?.uniquename &&
        (await this.salutation.refresh(data.salutation))
      : (this.salutation = data?.salutation?.uniquename
          ? (data.salutation as Salutation)
          : null)
    this.title
      ? data?.title?.uniquename && (await this.title.refresh(data.title))
      : (this.title = data?.title?.uniquename ? (data.title as Title) : null)
    this.partner
      ? data?.partner?.id && (await this.partner.refresh(data.partner))
      : (this.partner = data?.partner?.id ? (data.partner as Contact) : null)
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
    await Global.setFreshCollection<CompanyWithLocation, ICompanyWithLocation>(
      this.companiesWithLocation,
      data?.companiesWithLocation as ICompanyWithLocation[],
      CompanyWithLocation,
      'id'
    )
    await Global.setFreshCollection<Phonenumber, IPhonenumber>(
      this.phonenumbers,
      data?.phonenumbers as IPhonenumber[],
      Phonenumber,
      'id'
    )
    await Global.setFreshCollection<Email, IEmail>(
      this.emails,
      data?.emails as IEmail[],
      Email,
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

  public static getDatamodel(alreadyCalled: boolean) {
    if (alreadyCalled) {
      return
    }
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'contact',
        title: 'Kontakt',
        titlePlural: 'Kontakte',
        icon: 'far fa-address-book',
        isListable: true,
        isMain: true,
        parent: 1,
        sort: 'surname',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      surname: {
        label: 'Nachname',
        type: 'string',
      },
      givenname: {
        label: 'Vorname',
        type: 'string',
      },
      gender: {
        label: 'Geschlecht',
        type: Gender.getDatamodel(),
      },
      salutation: {
        label: 'Anrede',
        type: Salutation.getDatamodel(),
      },
      title: {
        label: 'Titel',
        type: Title.getDatamodel(),
      },
      additional_names: {
        label: 'Weitere Namen',
        multiple: true,
        type: 'string',
      },
      addresses: {
        label: 'Adressen',
        multiple: true,
        type: Address.getDatamodel(),
      },
      companiesWithLocation: {
        label: 'Firmen',
        multiple: true,
        type: CompanyWithLocation.getDatamodel(),
      },
      department: {
        label: 'Abteilung',
        type: 'string',
      },
      positions: {
        label: 'Positionen',
        multiple: true,
        type: 'string',
      },
      partner: {
        label: 'Partner',
        type: Contact.getDatamodel(true),
      },
      phonenumbers: {
        label: 'Telefonnummern',
        multiple: true,
        type: Phonenumber.getDatamodel(),
      },
      emails: {
        label: 'Email-Adressen',
        multiple: true,
        type: Email.getDatamodel(),
      },
      birthdate: {
        label: 'Geburtsdatum',
        type: 'date',
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
