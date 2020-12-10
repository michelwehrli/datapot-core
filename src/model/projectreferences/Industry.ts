import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IIndustry from '../../interface/model/projectreferences/IIndustry'
import Table from '../extends/Table'

@Entity()
export default class Industry extends Table implements IIndustry {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IIndustry) {
    if (!data) {
      data = {}
    }
    this.uniquename = data.uniquename
    this.label = data.label
    return this
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'industry',
        title: 'Branche',
        titlePlural: 'Branchen',
        icon: 'fa fa-industry',
        isListable: true,
        parent: 4,
        sort: 'label',
      },
      uniquename: {
        label: 'Eindeutiger Name',
        type: 'string',
        required: true,
      },
      label: {
        label: 'Bezeichnung',
        type: 'string',
      },
    }
  }
}
