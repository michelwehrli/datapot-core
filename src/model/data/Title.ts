import { Entity } from '@mikro-orm/core'
import ITitle from '../../interface/model/data/ITitle'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class Title extends UniquenameLabel implements ITitle {
  constructor(data: ITitle) {
    super(data)
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'title',
        title: 'Titel',
        titlePlural: 'Titel',
        icon: 'fa fa-user-md',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
