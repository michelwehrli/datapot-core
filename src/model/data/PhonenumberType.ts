import { Entity } from '@mikro-orm/core'
import IPhonenumberLine from '../../interface/model/data/IPhonenumberLine'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class PhonenumberType extends UniquenameLabel
  implements IPhonenumberLine {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'phonenumber_type',
        title: 'Telefon-Typ',
        titlePlural: 'Telefon-Typen',
        icon: 'fa fa-mobile-alt',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
