import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import ISocialmedia from '../../interface/model/data/ISocialmedia'
import DatabaseService from '../../service/DatabaseService'
import Table from './parents/Table'
import SocialmediaType from './SocialmediaType'

@Entity()
export default class Socialmedia extends Table {
  @PrimaryKey()
  id!: number
  @Property()
  url: string
  @ManyToOne(() => SocialmediaType, { eager: true })
  type: SocialmediaType

  constructor() {
    super()
  }

  public async create(data: ISocialmedia): Promise<Socialmedia> {
    this.id = data?.id
    this.url = data?.url
    this.type =
      (data?.type?.uniquename &&
        (await DatabaseService.findOne('data', SocialmediaType, {
          uniquename: data.type.uniquename,
        }))) ||
      (data?.type && (await new SocialmediaType().create(data.type)))
    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'socialmedia',
        title: 'Soziale Medien',
        titlePlural: 'Soziale Medien',
        isListable: false,
        sort: 'url',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
      },
      url: {
        label: 'URL',
        type: 'string',
        required: true,
      },
      type: {
        label: 'Typ',
        type: SocialmediaType.getDatamodel(),
        required: true,
      },
    })
  }
}
