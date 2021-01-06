export default class Task implements ITask {
  public readonly name: string
  public readonly birthDate: number
  public running: boolean
  public maxProgress: number
  public progress: number = 0
  public statusText: string

  public interval
  public timeout

  constructor(name: string, private killMyself: () => void) {
    this.name = name
    this.birthDate = new Date().getTime()
  }

  public start() {
    this.running = true
  }

  public reportProgress(progress: number) {
    this.progress = progress
  }

  public setStatusText(statusText: string) {
    this.statusText = statusText
  }

  public stop() {
    this.progress = 0
    this.running = false
    this.statusText = ''
    this.killMyself()
    clearInterval(this.interval)
    clearTimeout(this.timeout)
  }
}
