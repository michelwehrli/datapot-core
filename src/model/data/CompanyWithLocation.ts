import { Entity, PrimaryKey, ManyToOne } from '@mikro-orm/core'
import DataBuilder from '../../abstraction/DataBuilder'
import ICompanyWithLocation from '../../interface/model/data/ICompanyWithLocation'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import Address from './Address'
import Company from './Company'

@Entity()
export default class CompanyWithLocation extends Table
  implements ICompanyWithLocation {
  @PrimaryKey()
  id?: number

  @ManyToOne(() => Company, { eager: true })
  company?: Company

  @ManyToOne(() => Address, { eager: true })
  address?: Address

  constructor() {
    super()
  }

  async init(data: ICompanyWithLocation, clear?: boolean) {
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    if (data.company) {
      let found: Company = DataBuilder.getCache(
        'companywithlocation/company/' + data.company.name
      )
      if (!found && data.company.id) {
        found = await DatabaseService.findOne('data', Company, {
          id: data.company.id,
        })
      }
      if (!found) {
        found = new Company()
      }
      DataBuilder.setCache(
        'companywithlocation/company/' + data.company.name,
        found
      )
      found = await found.init(data.company)
      this.company = found
    }

    if (data.address) {
      let found: Address = DataBuilder.getCache(
        'company/addresses/' + JSON.stringify(data.address)
      )
      if (!found && data.address.id) {
        found = await DatabaseService.findOne('data', Address, {
          id: data.address.id,
        })
      }
      if (!found) {
        found = new Address()
      }
      DataBuilder.setCache(
        'company/addresses/' + JSON.stringify(data.address),
        found
      )
      found = await found.init(data.address)
      this.address = found
    }

    return this
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'companyWithLocation',
        title: 'Firmen mit Filialen',
        titlePlural: 'Firmen mit Filialen',
        icon: 'far fa-company',
        isListable: false,
        parent: 1,
        sort: 'company',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      company: {
        label: 'Firma',
        type: Company.getDatamodel(),
      },
      address: {
        label: 'Adresse',
        type: Address.getDatamodel(),
      },
    }
  }
}
