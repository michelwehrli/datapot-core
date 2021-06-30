import { Entity } from '@mikro-orm/core'
import UniquenameLabel from '../data/parents/UniquenameLabel'

@Entity()
export default class Design extends UniquenameLabel {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'system',
        name: 'design',
        title: 'Design',
        titlePlural: 'Designs',
        icon: 'fa fa-paint-roller',
        isListable: true,
        parent: 3,
        sort: 'label',
        superOnly: true,
      },
    })
  }
}
