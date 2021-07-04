import Contact from '../model/data/Contact'
import Phonenumber from '../model/data/Phonenumber'
import DatabaseService from '../service/DatabaseService'

export default class CSVExporter {
  public static async getCSV() {
    const contacts: Contact[] = await DatabaseService.find('data', Contact)

    let csv: string = ''

    csv +=
      'RW-Status;Kunden-Nr.;Beziehung;Anrede_3pmw;Namenszusatz;Vorname;Zweiter Vorname;Nachname;Name+Vorname (WORK-Field);Suffix;Partner/in;Firma;Abteilung;Position;Beruf;Strasse geschäftlich;Strasse geschäftlich 2;Strasse geschäftlich 3;Postleitzahl geschäftlich;Ort geschäftlich;Region geschäftlich;Land/Region geschäftlich;Firma 2;Postleitzahl geschäftlich 2;Land/Region geschäftlich 2;Straße privat;Straße privat2;Straße privat3;Postleitzahl privat;Ort privat;Bundesland/Kanton privat;Land/Region privat;Weitere Straße;Weitere Straße 2;Weitere Straße 3;Weitere Postleitzahl;Weiterer Ort;Weiteres/r Bundesland/Kanton;Weiteres/e Land/Region;Name Assistent;Telefon Assistent;Telefon geschäftlich;Telefon geschäftlich 2;Haupttelefon;Mobiltelefon;Mobiltelefon2;Weiteres Telefon;Fax geschäftlich;Telefon (privat);Telefon (privat 2);E-Mail-Adresse;E-Mail-Typ;E-Mail: Angezeigter Name;E-Mail 2: Adresse;E-Mail 2: Typ;E-Mail 2: Angezeigter Name;E-Mail 3: Adresse;E-Mail 3: Typ;E-Mail 3: Angezeigter Name;E-Mail-Auswahl;E-Mail ausgewählt;Webseite;Benutzer 1;Benutzer 2;Adressenauswahl;Adresse ausgewählt;Postanschrift;Geburtstag;Geschlecht;Kategorien;Kategorie 2;Kategorie 3;Kategorie 4;Priorität;Privat;Vertraulichkeit;WK_2018;WK_2019_ENTSCHEID;WK_2019_PRINT;WK_2019_Antworten;WK_2020_ENTSCHEID2;WK_2020_PRINT3;WK_2020_Antworten4;Fest_2020;Fest_2021\n'

    for (const contact of contacts) {
      const mobilePhones: string[] = []
      const businessPhones: string[] = []
      const homePhones: string[] = []
      contact.phonenumbers.toArray().map((p: Phonenumber) => {
        if (p.line.uniquename === 'mobile') {
          mobilePhones.push(p.number)
        } else {
          if (p.type.uniquename === 'business') {
            businessPhones.push(p.number)
          } else {
            homePhones.push(p.number)
          }
        }
      })

      csv += `"${contact.rwstatus ? contact.rwstatus.label : ''}";"${
        contact.id ? contact.id : ''
      }";"${contact.relationship ? contact.relationship.label : ''}";"${
        contact.salutation ? contact.salutation.label : ''
      }";"${contact.title ? contact.title.label : ''}";"${
        contact.givenname ? contact.givenname : ''
      }";"${
        contact.additional_names && contact.additional_names.length
          ? contact.additional_names[0]
          : ''
      }";"${contact.surname ? contact.surname : ''}";"${
        contact.givenname ? contact.givenname + ' ' : ''
      }${contact.surname ? contact.surname : ''}";"";"${
        contact.partner && contact.partner.givenname
          ? contact.partner.givenname + ' '
          : ''
      }${
        contact.partner && contact.partner.surname
          ? contact.partner.surname
          : ''
      }";"${
        contact.companiesWithLocation && contact.companiesWithLocation.length
          ? contact.companiesWithLocation[0].company.name
          : ''
      }";"${contact.department ? contact.department : ''}";"${
        contact.positions && contact.positions[0] ? contact.positions[0] : ''
      }";"${contact.profession ? contact.profession : ''}";"${
        contact.companiesWithLocation &&
        contact.companiesWithLocation[0] &&
        contact.companiesWithLocation[0].address &&
        contact.companiesWithLocation[0].address.street
          ? contact.companiesWithLocation[0].address.street
          : ''
      }";"";"";"${
        contact.companiesWithLocation &&
        contact.companiesWithLocation[0] &&
        contact.companiesWithLocation[0].address &&
        contact.companiesWithLocation[0].address.zip &&
        contact.companiesWithLocation[0].address.zip.zip
          ? contact.companiesWithLocation[0].address.zip.zip
          : ''
      }";"${
        contact.companiesWithLocation &&
        contact.companiesWithLocation[0] &&
        contact.companiesWithLocation[0].address &&
        contact.companiesWithLocation[0].address.zip &&
        contact.companiesWithLocation[0].address.zip.location
          ? contact.companiesWithLocation[0].address.zip.location
          : ''
      }";"${
        contact.companiesWithLocation &&
        contact.companiesWithLocation[0] &&
        contact.companiesWithLocation[0].address &&
        contact.companiesWithLocation[0].address.county &&
        contact.companiesWithLocation[0].address.county.label
          ? contact.companiesWithLocation[0].address.county.label
          : ''
      }";"${
        contact.companiesWithLocation &&
        contact.companiesWithLocation[0] &&
        contact.companiesWithLocation[0].address &&
        contact.companiesWithLocation[0].address.country &&
        contact.companiesWithLocation[0].address.country.label
          ? contact.companiesWithLocation[0].address.country.label
          : ''
      }";"";"";"";"${
        contact.addresses && contact.addresses[0] && contact.addresses[0].street
          ? contact.addresses[0].street
          : ''
      }";"";"";"${
        contact.addresses &&
        contact.addresses[0] &&
        contact.addresses[0].zip &&
        contact.addresses[0].zip.zip
          ? contact.addresses[0].zip.zip
          : ''
      }";"${
        contact.addresses &&
        contact.addresses[0] &&
        contact.addresses[0].zip &&
        contact.addresses[0].zip.location
          ? contact.addresses[0].zip.location
          : ''
      }";"${
        contact.addresses &&
        contact.addresses[0] &&
        contact.addresses[0].county &&
        contact.addresses[0].county.label
          ? contact.addresses[0].county.label
          : ''
      }";"${
        contact.addresses &&
        contact.addresses[0] &&
        contact.addresses[0].country &&
        contact.addresses[0].country.label
          ? contact.addresses[0].country.label
          : ''
      }";"";"";"";"";"";"";"";"";"";"${
        businessPhones && businessPhones[0] ? businessPhones[0] : ''
      }";"${businessPhones && businessPhones[1] ? businessPhones[1] : ''}";"${
        contact.companiesWithLocation &&
        contact.companiesWithLocation[0] &&
        contact.companiesWithLocation[0].company &&
        contact.companiesWithLocation[0].company.phonenumbers &&
        contact.companiesWithLocation[0].company.phonenumbers[0] &&
        contact.companiesWithLocation[0].company.phonenumbers[0].number
          ? contact.companiesWithLocation[0].company.phonenumbers[0].number
          : ''
      }";"${mobilePhones && mobilePhones[0] ? mobilePhones[0] : ''}";"${
        mobilePhones && mobilePhones[1] ? mobilePhones[1] : ''
      }";"";"";"";"";"${
        contact.emails && contact.emails[0] && contact.emails[0].address
          ? contact.emails[0].address
          : ''
      }";"SMTP";"${
        contact.emails && contact.emails[0] && contact.emails[0].address
          ? contact.emails[0].address
          : ''
      }";"${
        contact.emails && contact.emails[1] && contact.emails[1].address
          ? contact.emails[1].address
          : ''
      }";"SMTP";"${
        contact.emails && contact.emails[1] && contact.emails[1].address
          ? contact.emails[1].address
          : ''
      }";"${
        contact.emails && contact.emails[2] && contact.emails[2].address
          ? contact.emails[2].address
          : ''
      }";"SMTP";"${
        contact.emails && contact.emails[2] && contact.emails[2].address
          ? contact.emails[2].address
          : ''
      }";"";"";"${
        contact.websites && contact.websites[0] ? contact.websites[0] : ''
      }";"";"";"";"";"";"${
        contact.birthdate
          ? new Date(contact.birthdate).toLocaleDateString('de-CH', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : ''
      }";"${
        contact.gender && contact.gender.label ? contact.gender.label : ''
      }";"${
        contact.categories &&
        contact.categories[0] &&
        contact.categories[0].label
          ? contact.categories[0].label
          : ''
      }";"${
        contact.categories &&
        contact.categories[1] &&
        contact.categories[1].label
          ? contact.categories[1].label
          : ''
      }";"${
        contact.categories &&
        contact.categories[2] &&
        contact.categories[2].label
          ? contact.categories[2].label
          : ''
      }";"${
        contact.categories &&
        contact.categories[3] &&
        contact.categories[3].label
          ? contact.categories[3].label
          : ''
      }";"";"";"";"";"";"";"";"";"";"";"";"";\n`
    }

    return csv
  }
}
