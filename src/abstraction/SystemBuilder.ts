import IUser from '../interface/model/system/IUser'
import User from '../model/system/User'
import DatabaseService from '../service/DatabaseService'

export default class SystemBuilder {
  constructor() {}

  public async init() {
    const users: IUser[] = [
      {
        username: 'michel',
        issuperuser: true,
        givenname: 'Michel',
        surname: 'Wehrli',
        email: 'michel@wehrli.me',
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
        email: 'ralph.wehrli@3pmw.ch',
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
        email: 'kathrin.meier@3pmw.ch',
        password: '123',
        design: {
          uniquename: 'light',
          label: 'Hell',
        },
      },
    ]
    for (const userData of users) {
      await DatabaseService.insert('system', [await new User().init(userData)])
    }
  }
}
