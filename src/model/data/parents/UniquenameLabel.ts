import { PrimaryKey, Property } from '@mikro-orm/core'
import IUniquenameLabel from '../../../interface/model/extends/IUniquenameLabel'
import Table from './Table'

export default class UniquenameLabel extends Table implements IUniquenameLabel {
  @PrimaryKey()
  uniquename: string
  @Property()
  label: string

  constructor(data: IUniquenameLabel) {
    super(data)
    this.uniquename = data?.uniquename
    this.label = data?.label
  }

  public refresh(data: IUniquenameLabel) {
    super.refresh(data)
    this.uniquename = data?.uniquename
    this.label = data?.label
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
