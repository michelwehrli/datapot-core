import { Entity } from '@mikro-orm/core'
import IPhonenumberLine from '../../interface/model/data/IPhonenumberLine'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class PhonenumberLine extends UniquenameLabel
  implements IPhonenumberLine {
  constructor(data: IPhonenumberLine) {
    super(data)
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'phonenumber_line',
        title: 'Telefon-Methode',
        titlePlural: 'Telefon-Methoden',
        icon: 'fa fa-mobile-alt',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
