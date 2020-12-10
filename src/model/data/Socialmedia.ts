import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import DataBuilder from '../../abstraction/DataBuilder'
import ISocialmedia from '../../interface/model/data/ISocialmedia'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import SocialmediaType from './SocialmediaType'

@Entity()
export default class Socialmedia extends Table implements ISocialmedia {
  @PrimaryKey()
  id: number

  @Property()
  url: string

  @ManyToOne(() => SocialmediaType, {
    eager: true,
  })
  type: SocialmediaType

  constructor() {
    super()
  }

  async init(data: ISocialmedia) {
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    this.url = data.url

    if (data && data.type && data.type.uniquename) {
      let existingType: SocialmediaType
      if (data && data.type) {
        existingType = await DatabaseService.findOne('data', SocialmediaType, {
          uniquename: data.type.uniquename,
        })
      }
      this.type = existingType
        ? existingType
        : DataBuilder.getCache('socialmedia/' + JSON.stringify(data.type))
        ? DataBuilder.getCache('socialmedia/' + JSON.stringify(data.type))
        : await new SocialmediaType().init(data.type)
      DataBuilder.setCache(
        'socialmedia/' + JSON.stringify(data.type),
        this.type
      )
    }
    return this
  }

  public static getDatamodel() {
    return {
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
    }
  }
}
