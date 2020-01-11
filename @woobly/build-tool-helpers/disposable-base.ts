import CriticalSection from "./critical-section"
import IDisposable from "./i-disposable"

export default abstract class DisposableBase implements IDisposable {
  protected readonly criticalSection = new CriticalSection()

  async initialize(): Promise<void> {
    await this.criticalSection.execute(async () => {
      await this.generate()
    })
  }

  async dispose(): Promise<void> {
    await this.criticalSection.execute(async () => {
      await this.cleanUp()
    })
  }

  abstract generate(): Promise<void>
  abstract cleanUp(): Promise<void>
}
