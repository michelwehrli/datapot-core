import { Property } from '@mikro-orm/core'
import ITable from '../../../interface/model/extends/ITable'

export default class Table implements ITable {
  @Property()
  _creation_date: number = new Date().getTime()
  @Property({ onUpdate: () => new Date().getTime() })
  _modification_date: number = new Date().getTime()
  @Property({ nullable: true })
  _defaultValue?: boolean

  constructor(data: ITable) {
    this._defaultValue = data?._defaultValue || null
  }

  public refresh(data: ITable) {
    this._defaultValue = data._defaultValue || null
  }

  public static getDatamodel(alreadyCalled = false): any {
    return {
      _defaultValue: {
        label: 'Standardwert',
        type: 'boolean',
        isListable: false,
      },
    }
  }
}
