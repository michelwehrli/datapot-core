import { Entity } from '@mikro-orm/core'
import IDesign from '../../interface/model/system/IDesign'
import UniquenameLabel from '../data/parents/UniquenameLabel'

@Entity()
export default class Design extends UniquenameLabel {
  constructor(data: IDesign) {
    super(data)
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
