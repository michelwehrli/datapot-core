import { Entity } from '@mikro-orm/core'
import ICounty from '../../interface/model/data/ICounty'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class County extends UniquenameLabel implements ICounty {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
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
    })
  }
}
