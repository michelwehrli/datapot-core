import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ICounty from '../../interface/model/data/ICounty'
import Table from '../extends/Table'

@Entity()
export default class County extends Table implements ICounty {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ICounty) {
    if (!data) {
      data = {}
    }
    this.uniquename = data.uniquename
    this.label = data.label
    return this
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'county',
        title: 'Region',
        titlePlural: 'Regionen',
        icon: 'far fa-flag',
        isListable: true,
        parent: 2,
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
    }
  }
}
