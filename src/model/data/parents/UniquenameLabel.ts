import { PrimaryKey, Property } from '@mikro-orm/core'
import IUniquenameLabel from '../../../interface/model/extends/IUniquenameLabel'
import Table from './Table'

export default class UniquenameLabel extends Table implements IUniquenameLabel {
  @PrimaryKey()
  uniquename: string
  @Property()
  label: string

  constructor() {
    super()
  }

  public async create(data: IUniquenameLabel): Promise<UniquenameLabel> {
    this.uniquename = data?.uniquename
    this.label = data?.label
    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      uniquename: {
        label: 'Eindeutiger Name',
        type: 'string',
        required: true,
      },
      label: {
        label: 'Bezeichnung',
        type: 'string',
      },
    })
  }
}
