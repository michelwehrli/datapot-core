import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IDesign from '../../interface/model/system/IDesign'
import Table from '../extends/Table'

@Entity()
export default class Design extends Table implements IDesign {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IDesign) {
    super.init(data)
    if (!data) {
      data = {}
    }
    this.uniquename = data.uniquename
    this.label = data.label
    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getParentDatamodel(), {
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
      uniquename: {
        label: 'Eindeutiger Name',
        type: 'string',
        required: true,
      },
      label: {
        label: 'Bezeichnung',
        type: 'string',
        required: true,
      },
    })
  }
}
