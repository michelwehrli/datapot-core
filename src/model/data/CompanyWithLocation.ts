import { Entity, ManyToOne, PrimaryKey, wrap } from '@mikro-orm/core'
import ICompanyWithLocation from '../../interface/model/data/ICompanyWithLocation'
import DatabaseService from '../../service/DatabaseService'
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

  constructor() {
    super()
  }

  public async create(
    data: ICompanyWithLocation
  ): Promise<CompanyWithLocation> {
    this.id = data?.id
    this.company =
      (data?.company?.id &&
        (await DatabaseService.findOne<Company>('data', Company, {
          id: data.company.id,
        }))) ||
      (data?.company && (await new Company().create(data.company)))
    this.address =
      (data?.address?.id &&
        (await DatabaseService.findOne<Address>('data', Address, {
          id: data.address.id,
        }))) ||
      (data?.address && (await new Address().create(data.address)))

    return this
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
