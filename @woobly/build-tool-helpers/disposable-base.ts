import CriticalSection from "./critical-section"

export default abstract class DisposableBase {
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
