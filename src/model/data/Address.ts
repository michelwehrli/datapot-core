import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import DataImporter from '../../abstraction/DataImporter'
import IAddress from '../../interface/model/data/IAddress'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import Country from './Country'
import County from './County'
import Zip from './Zip'

@Entity()
export default class Address extends Table implements IAddress {
  @PrimaryKey()
  id: number

  @Property()
  street: string

  @Property()
  additionals: string

  @Property({ nullable: true })
  pobox?: string

  @ManyToOne(() => Zip, {
    eager: true,
  })
  zip?: Zip

  @ManyToOne(() => County, {
    eager: true,
  })
  county?: County

  @ManyToOne(() => Country, {
    eager: true,
  })
  country?: Country

  constructor() {
    super()
  }

  async init(data: IAddress) {
    super.init(data)
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    this.street = data.street
    this.additionals = data.additionals
    this.pobox = data.pobox

    if (data && data.zip && data.zip.zip) {
      const existing: Zip = await DatabaseService.findOne('data', Zip, {
        zip: data.zip.zip,
      })
      this.zip = existing
        ? existing
        : DataImporter.getCache(JSON.stringify(data.zip))
        ? DataImporter.getCache(JSON.stringify(data.zip))
        : await new Zip().init(data.zip)
      DataImporter.setCache(JSON.stringify(data.zip), this.zip)
    }

    if (data && data.county && data.county.uniquename) {
      const existing: County = await DatabaseService.findOne('data', County, {
        uniquename: data.county.uniquename,
      })
      this.county = existing
        ? existing
        : DataImporter.getCache(JSON.stringify(data.county))
        ? DataImporter.getCache(JSON.stringify(data.county))
        : await new County().init(data.county)
      DataImporter.setCache(JSON.stringify(data.county), this.county)
    }

    if (data && data.country && data.country.uniquename) {
      const existing: Country = await DatabaseService.findOne('data', Country, {
        uniquename: data.country.uniquename,
      })
      this.country = existing
        ? existing
        : DataImporter.getCache(JSON.stringify(data.country))
        ? DataImporter.getCache(JSON.stringify(data.country))
        : await new Country().init(data.country)
      DataImporter.setCache(JSON.stringify(data.country), this.country)
    }

    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getParentDatamodel(), {
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
