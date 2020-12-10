import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IComplexity from '../../interface/model/projectreferences/IComplexity'
import Table from '../extends/Table'

@Entity()
export default class Complexity extends Table implements IComplexity {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IComplexity) {
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
        name: 'complexity',
        title: 'Komplexität',
        titlePlural: 'Komplexitäten',
        icon: 'fa fa-tachometer-alt',
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
