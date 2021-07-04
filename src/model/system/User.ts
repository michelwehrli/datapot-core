import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import Design from './Design'
import Document from './Document'
import Table from '../data/parents/Table'
import IUser from '../../interface/model/system/IUser'
import DatabaseService from '../../service/DatabaseService'

@Entity()
export default class User extends Table {
  @PrimaryKey()
  id: number
  @Property({ nullable: true })
  issuperuser: boolean
  @Property({ unique: true })
  username: string
  @Property({ nullable: true })
  givenname: string
  @Property({ nullable: true })
  surname: string
  @Property({ nullable: true })
  email: string
  @ManyToOne(() => Document, { eager: true, nullable: true })
  image: Document
  @Property({ nullable: true })
  password: string
  @Property({ nullable: true })
  configuration: string
  @ManyToOne(() => Design, { eager: true, nullable: true })
  design: Design
  @Property({ nullable: true })
  refresh_token: string
  @Property({ nullable: true })
  color: string
  @Property({ nullable: true })
  o365_oauth_token: string
  @Property({ nullable: true })
  o365_oaccess_token: string

  constructor() {
    super()
  }

  public async create(data: IUser): Promise<User> {
    this.id = data?.id
    this.issuperuser = data?.issuperuser
    this.username = data?.username
    this.givenname = data?.givenname
    this.surname = data?.surname
    this.email = data?.email
    this.password = data?.password
    this.configuration = data?.configuration
    this.refresh_token = data?.refresh_token
    this.color = data?.color
    this.o365_oauth_token = data?.o365_oauth_token
    this.o365_oaccess_token = data?.o365_oaccess_token

    this.image =
      data?.image &&
      ((data?.image?.id &&
        (await DatabaseService.findOne('data', Document, {
          id: data.image.id,
        }))) ||
        (data?.image && (await new Document().create(data.image))))

    this.design =
      data?.image &&
      ((data?.design?.uniquename &&
        (await DatabaseService.findOne('data', Design, {
          uniquename: data.design.uniquename,
        }))) ||
        (data?.design && (await new Design().create(data.design))))

    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'system',
        name: 'user',
        title: 'Benutzer',
        titlePlural: 'Benutzer',
        icon: 'fa fa-users-cog',
        isListable: true,
        parent: 3,
        sort: 'username',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      username: {
        label: 'Benutzername',
        type: 'string',
      },
      givenname: {
        label: 'Vorname',
        type: 'string',
      },
      surname: {
        label: 'Nachname',
        type: 'string',
      },
      email: {
        label: 'Email-Adresse',
        type: 'string',
      },
      issuperuser: {
        label: 'Ist Superuser',
        type: 'boolean',
      },
      image: {
        label: 'Bild',
        type: Document.getDatamodel(),
        isListable: false,
      },
      password: {
        isSecure: true,
      },
      configuration: {
        label: 'Konfiguration',
        type: 'string',
        isListable: false,
      },
      design: {
        label: 'Design',
        type: Design.getDatamodel(),
      },
      color: {
        label: 'Farbe',
        type: 'string',
      },
      refresh_token: {
        isSecure: true,
      },
      o365_oauth_token: {
        isSecure: true,
      },
      o365_oaccess_token: {
        isSecure: true,
      },
    })
  }
}
