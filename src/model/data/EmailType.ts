import { Entity } from '@mikro-orm/core'
import IEmailType from '../../interface/model/data/IEmailType'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class EmailType extends UniquenameLabel implements IEmailType {
  constructor(data: IEmailType) {
    super(data)
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'email_type',
        title: 'Emailtyp',
        titlePlural: 'Emailtypen',
        icon: 'far fa-envelope',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
