import { Entity } from '@mikro-orm/core'
import IRWStatus from '../../interface/model/data/IRWStatus'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class RWStatus extends UniquenameLabel implements IRWStatus {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'rwstatus',
        title: 'RW-Status',
        titlePlural: 'RW-Status',
        icon: 'fa fa-thermometer-half',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
