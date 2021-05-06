import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import IUser from '../../interface/model/system/IUser'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import Design from './Design'
import Document from './Document'
import bcrypt from 'bcrypt'

@Entity()
export default class User extends Table implements IUser {
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

  @ManyToOne(() => Document, {
    eager: true,
    nullable: true,
  })
  image: Document

  @Property({ nullable: true })
  password: string

  @Property({ nullable: true })
  configuration: string

  @ManyToOne(() => Design, {
    eager: true,
    nullable: true,
  })
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

  async init(data: IUser) {
    super.init(data)
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    this.issuperuser = data.issuperuser
    this.username = data.username
    this.givenname = data.givenname
    this.surname = data.surname
    this.email = data.email
    this.color = data.color
    this.configuration = data.configuration

    if (data.image && Object.keys(data.image).length) {
      const existingImage: Document = await DatabaseService.findOne(
        'system',
        Document,
        {
          id: data.image.id,
        }
      )
      this.image = existingImage
        ? existingImage
        : await new Document().init(data.image)
    } else {
      this.image = undefined
    }

    if (data.password) {
      const hash = bcrypt.hashSync(data.password, 10)
      this.password = hash
    }
    if (data.refresh_token) {
      this.refresh_token = data.refresh_token
    }
    if (data.o365_oaccess_token) {
      this.refresh_token = data.o365_oaccess_token
    }
    if (data.o365_oauth_token) {
      this.refresh_token = data.o365_oauth_token
    }

    if (
      data.design &&
      Object.keys(data.design) &&
      Object.keys(data.design).length
    ) {
      const existingDesign: Design = await DatabaseService.findOne(
        'system',
        Design,
        {
          uniquename: data.design.uniquename,
        }
      )
      this.design = existingDesign
        ? existingDesign
        : await new Design().init(data.design)
    } else {
      this.design = undefined
    }

    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getParentDatamodel(), {
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
