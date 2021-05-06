import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ISocialmediaType from '../../interface/model/data/ISocialmediaType'
import Table from '../extends/Table'

@Entity()
export default class SocialmediaType extends Table implements ISocialmediaType {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ISocialmediaType) {
    super.init(data)
    if (!data) {
      data = {}
    }
    this.uniquename = data.uniquename
    this.label = data.label
    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getParentDatamodel(), {
      __meta: {
        db: 'data',
        name: 'socialmedia_type',
        title: 'Soziale Medien Typ',
        titlePlural: 'Socialmedia-Typen',
        icon: 'far fa-thumbs-up',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
      uniquename: {
        label: 'Eindeutiger Name',
        type: 'string',
        required: true,
      },
      label: {
        label: 'Bezeichnung',
        type: 'string',
      },
    })
  }
}
