import { Entity, ManyToOne, PrimaryKey, Property, wrap } from '@mikro-orm/core'
import IAddress from '../../interface/model/data/IAddress'
import IContact from '../../interface/model/data/IContact'
import DatabaseService from '../../service/DatabaseService'
import Country from './Country'
import County from './County'
import Table from './parents/Table'
import Zip from './Zip'

@Entity()
export default class Address extends Table {
  @PrimaryKey()
  id!: number
  @Property()
  street: string
  @Property({ nullable: true })
  additionals?: string
  @Property({ nullable: true })
  pobox?: string
  @ManyToOne(() => Zip, { eager: true, nullable: true })
  zip?: Zip
  @ManyToOne(() => County, { eager: true, nullable: true })
  county?: County
  @ManyToOne(() => Country, { eager: true, nullable: true })
  country?: Country

  constructor() {
    super()
  }

  public async create(data: IAddress): Promise<Address> {
    this.id = data?.id
    this.street = data?.street
    this.additionals = data?.additionals
    this.pobox = data?.pobox

    this.zip =
      (data?.zip?.id &&
        (await DatabaseService.findOne('data', Zip, {
          id: data.zip.id,
        }))) ||
      (data?.zip && (await new Zip().create(data.zip)))

    this.county =
      (data?.county?.uniquename &&
        (await DatabaseService.findOne('data', County, {
          uniquename: data.county.uniquename,
        }))) ||
      (data?.county && (await new County().create(data.county)))

    this.country =
      (data?.country?.uniquename &&
        (await DatabaseService.findOne('data', Country, {
          uniquename: data.country.uniquename,
        }))) ||
      (data?.country && (await new Country().create(data.country)))

    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'address',
        title: 'Adresse',
        icon: 'far fa-address-card',
        titlePlural: 'Adressen',
        isListable: false,
        sort: 'street',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
      },
      street: {
        label: 'Strasse',
        type: 'string',
      },
      additionals: {
        label: 'Zusatz',
        type: 'additionals',
      },
      pobox: {
        label: 'Postfach',
        type: 'string',
      },
      zip: Zip.getDatamodel(),
      county: County.getDatamodel(),
      country: Country.getDatamodel(),
    })
  }
}
