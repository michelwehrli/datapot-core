import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import ISocialmedia from '../../interface/model/data/ISocialmedia'
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

  constructor(data: ISocialmedia) {
    super(data)
    this.id = data?.id
    this.url = data?.url
    this.type = (data?.type as SocialmediaType) || null
  }

  public async refresh(data: ISocialmedia) {
    this.url = data?.url
    this.type
      ? data?.type?.uniquename && (await this.type.refresh(data.type))
      : (this.type = data?.type?.uniquename
          ? (data.type as SocialmediaType)
          : null)
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
