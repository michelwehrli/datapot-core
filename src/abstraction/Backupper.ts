import * as dotenv from 'dotenv'
import FTPS from 'ftps'

import Task from '../model/internal/Task'
import User from '../model/system/User'

export default class Backupper {
  private static task: Task

  constructor() {}

  public static async start(task: Task, user: User) {
    this.task = task

    dotenv.config({
      path: '../../.env',
    })

    this.task.maxProgress = 1

    setTimeout(() => {
      /*var ftps = new FTPS({
      host: process.env['BACKUP_3PMW_HOST'],
      username: process.env['BACKUP_3PMW_USERNAME'],
      password: process.env['BACKUP_3PMW_PASSWORD'],
      protocol: process.env['BACKUP_3PMW_PROTOCOL'],
      port: parseInt(process.env['BACKUP_3PMW_PORT']),
    })*/

      this.task.progress = 1
      this.task.stop()
    }, 5000)
  }

  public static async stop() {}
}
