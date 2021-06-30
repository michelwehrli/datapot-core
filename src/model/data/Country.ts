import { Entity } from '@mikro-orm/core'
import ICountry from '../../interface/model/data/ICountry'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class Country extends UniquenameLabel implements ICountry {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
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
    })
  }
}
