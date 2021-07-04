import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import IContact from '../../interface/model/data/IContact'
import DatabaseService from '../../service/DatabaseService'
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
  profession?: string
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

  constructor() {
    super()
  }

  public async create(data: IContact): Promise<Contact> {
    this.id = data?.id
    this.birthdate = data?.birthdate
    this.givenname = data?.givenname
    this.surname = data?.surname
    this.department = data?.department
    this.profession = data?.profession
    this.remarks = data?.remarks
    this.additional_names = data?.additional_names
    this.websites = data?.websites
    this.positions = data?.positions

    this.gender =
      data?.gender &&
      ((data?.gender?.uniquename &&
        (await DatabaseService.findOne('data', Gender, {
          uniquename: data.gender.uniquename,
        }))) ||
        (data?.gender && (await new Gender().create(data.gender))))
    this.salutation =
      data?.salutation &&
      ((data?.salutation?.uniquename &&
        (await DatabaseService.findOne('data', Salutation, {
          uniquename: data.salutation.uniquename,
        }))) ||
        (data?.salutation && (await new Salutation().create(data.salutation))))
    this.title =
      data?.title &&
      ((data?.title?.uniquename &&
        (await DatabaseService.findOne('data', Title, {
          uniquename: data.title.uniquename,
        }))) ||
        (data?.title && (await new Title().create(data.title))))
    this.partner =
      data?.partner &&
      ((data?.partner?.id &&
        (await DatabaseService.findOne('data', Contact, {
          id: data.partner.id,
        }))) ||
        (data?.partner && (await new Contact().create(data.partner))))
    this.rwstatus =
      data?.rwstatus &&
      ((data?.rwstatus?.uniquename &&
        (await DatabaseService.findOne('data', RWStatus, {
          uniquename: data.rwstatus.uniquename,
        }))) ||
        (data?.rwstatus && (await new RWStatus().create(data.rwstatus))))
    this.relationship =
      data?.relationship &&
      ((data?.relationship?.uniquename &&
        (await DatabaseService.findOne('data', Relationship, {
          uniquename: data.relationship.uniquename,
        }))) ||
        (data?.relationship &&
          (await new Relationship().create(data.relationship))))

    this.addresses.set(
      await Global.getCollection<Address>(data.addresses as any, 'id', Address)
    )
    this.companiesWithLocation.set(
      await Global.getCollection<CompanyWithLocation>(
        data.companiesWithLocation as any,
        'id',
        CompanyWithLocation
      )
    )
    this.phonenumbers.set(
      await Global.getCollection<Phonenumber>(
        data.phonenumbers as any,
        'id',
        Phonenumber
      )
    )
    this.emails.set(
      await Global.getCollection<Email>(data.emails as any, 'id', Email)
    )
    this.social_medias.set(
      await Global.getCollection<Socialmedia>(
        data.social_medias as any,
        'id',
        Socialmedia
      )
    )
    this.categories.set(
      await Global.getCollection<Category>(
        data.categories as any,
        'uniquename',
        Category
      )
    )

    return this
  }

  public static getNestedPaths() {
    return [
      'partner',
      'addresses.zip',
      'addresses.county',
      'addresses.country',
      'emails.type',
      'phonenumbers.type',
      'phonenumbers.line',
      'social_medias.type',
      'companiesWithLocation.address',
      'companiesWithLocation.address.zip',
      'companiesWithLocation.address.county',
      'companiesWithLocation.address.country',
      'companiesWithLocation.company',
    ]
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
      profession: {
        label: 'Berufe',
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
