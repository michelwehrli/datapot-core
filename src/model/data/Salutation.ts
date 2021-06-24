import { Entity } from '@mikro-orm/core'
import ISalutation from '../../interface/model/data/ISalutation'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class Salutation extends UniquenameLabel implements ISalutation {
  constructor(data: ISalutation) {
    super(data)
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'salutation',
        title: 'Anrede',
        titlePlural: 'Anreden',
        icon: 'far fa-handshake',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
