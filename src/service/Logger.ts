import * as fs from 'fs'

export default class Logger {
  public static log(name: string, message: string) {
    try {
      fs.appendFileSync(`../../log/${name}.log`, `${message}\n`)
    } catch (exc) {}
  }
}
