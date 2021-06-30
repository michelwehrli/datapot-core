import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import ICompany from '../../interface/model/data/ICompany'
import DatabaseService from '../../service/DatabaseService'
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

  constructor() {
    super()
  }

  public async create(data: ICompany): Promise<Company> {
    this.id = data?.id
    this.name = data?.name
    this.remarks = data?.remarks
    this.websites = data?.websites

    this.contact_person =
      (data?.contact_person?.id &&
        (await DatabaseService.findOne('data', Contact, {
          id: data.contact_person.id,
        }))) ||
      (data?.contact_person &&
        (await new Contact().create(data.contact_person)))
    this.rwstatus =
      (data?.rwstatus?.uniquename &&
        (await DatabaseService.findOne('data', RWStatus, {
          uniquename: data.rwstatus.uniquename,
        }))) ||
      (data?.rwstatus && (await new RWStatus().create(data.rwstatus)))
    this.relationship =
      (data?.relationship?.uniquename &&
        (await DatabaseService.findOne('data', Relationship, {
          uniquename: data.relationship.uniquename,
        }))) ||
      (data?.relationship &&
        (await new Relationship().create(data.relationship)))

    this.addresses.set(
      await Global.getCollection<Address>(data.addresses as any, 'id', Address)
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
      'contact_person',
      'addresses.zip',
      'addresses.county',
      'addresses.country',
      'emails.type',
      'phonenumbers.type',
      'phonenumbers.line',
      'social_medias.type',
    ]
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
