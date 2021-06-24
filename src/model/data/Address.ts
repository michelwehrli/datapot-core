import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import IAddress from '../../interface/model/data/IAddress'
import IContact from '../../interface/model/data/IContact'
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

  constructor(data: IAddress) {
    super(data)
    this.id = data?.id
    this.street = data?.street
    this.additionals = data?.additionals
    this.pobox = data?.pobox
    this.zip = (data?.zip as Zip) || null
    this.county = (data?.county as County) || null
    this.country = (data?.country as Country) || null
  }

  public async refresh(data: IAddress) {
    this.street = data?.street
    this.additionals = data?.additionals
    this.pobox = data?.pobox
    this.zip
      ? data?.zip?.id && (await this.zip.refresh(data.zip))
      : (this.zip = data?.zip?.id ? (data.zip as Zip) : null)
    this.county
      ? data?.county?.uniquename && (await this.county.refresh(data.county))
      : (this.county = data?.county?.uniquename
          ? (data.county as County)
          : null)
    this.country
      ? data?.country?.uniquename && (await this.country.refresh(data.country))
      : (this.country = data?.country?.uniquename
          ? (data.country as Country)
          : null)
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
