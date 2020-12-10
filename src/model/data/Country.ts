import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ICountry from '../../interface/model/data/ICountry'
import Table from '../extends/Table'

@Entity()
export default class Country extends Table implements ICountry {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ICountry) {
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
        name: 'country',
        title: 'Land',
        titlePlural: 'Länder',
        icon: 'fa fa-globe-europe',
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
