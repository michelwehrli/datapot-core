import { Entity } from '@mikro-orm/core'
import IGender from '../../interface/model/data/IGender'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class Gender extends UniquenameLabel implements IGender {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'gender',
        title: 'Geschlecht',
        titlePlural: 'Geschlechter',
        icon: 'fa fa-venus-mars',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
