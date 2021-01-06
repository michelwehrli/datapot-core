import Task from '../model/internal/Task'

export default class TaskManager {
  private static tasks: Map<string, Task> = new Map()

  public static get(name: string) {
    if (!this.tasks.has(name)) {
      const task = new Task(name, () => {
        this.tasks.delete(name)
      })
      this.tasks.set(name, task)
    }
    return this.tasks.get(name)
  }

  public static kill() {}
}
