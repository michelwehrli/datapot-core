import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import ICompanyWithLocation from '../../interface/model/data/ICompanyWithLocation'
import Address from './Address'
import Company from './Company'
import Table from './parents/Table'

@Entity()
export default class CompanyWithLocation extends Table {
  @PrimaryKey()
  id!: number
  @ManyToOne(() => Company, { eager: true })
  company: Company
  @ManyToOne(() => Address, { eager: true, nullable: true })
  address?: Address

  constructor(data: ICompanyWithLocation) {
    super(data)
    this.id = data?.id
    this.company = (data?.company as Company) || null
    this.address = (data?.address as Address) || null
  }

  public async refresh(data: ICompanyWithLocation) {
    this.company
      ? data?.company?.id && (await this.company.refresh(data.company))
      : (this.company = data?.company?.id ? (data.company as Company) : null)
    this.address
      ? data?.address?.id && (await this.address.refresh(data.address))
      : (this.address = data?.address?.id ? (data.address as Address) : null)
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
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
    })
  }
}
