import IUser from '../interface/model/system/IUser'
import Design from '../model/system/Design'
import User from '../model/system/User'
import DatabaseService from '../service/DatabaseService'

export default class SystemImporter {
  constructor() {}

  public async init() {
    const users: IUser[] = [
      {
        username: 'michel',
        issuperuser: true,
        givenname: 'Michel',
        surname: 'Wehrli',
        password: '123',
        design: {
          uniquename: 'dark',
          label: 'Dunkel',
        },
      },
      {
        username: 'ralph',
        issuperuser: false,
        givenname: 'Ralph',
        surname: 'Wehrli',
        password: '123',
        design: {
          uniquename: 'light',
          label: 'Hell',
        },
      },
      {
        username: 'kathrin',
        issuperuser: false,
        givenname: 'Kathrin',
        surname: 'Meier',
        password: '123',
        design: {
          uniquename: 'light',
          label: 'Hell',
        },
      },
    ]
    for (const userData of users) {
      await DatabaseService.insert('system', [
        await new User().create(userData),
      ])
    }
  }
}
