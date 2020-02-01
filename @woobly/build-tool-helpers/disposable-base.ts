import CriticalSection from "./critical-section"
import IDisposable from "./i-disposable"

export default abstract class DisposableBase<TMetadata> implements IDisposable<TMetadata> {
  protected readonly criticalSection = new CriticalSection()

  async initialize(
    metadata: TMetadata,
  ): Promise<void> {
    await this.criticalSection.execute(async () => {
      await this.generate(metadata)
    })
  }

  async dispose(): Promise<void> {
    await this.criticalSection.execute(async () => {
      await this.cleanUp()
    })
  }

  abstract generate(
    metadata: TMetadata,
  ): Promise<void>

  abstract cleanUp(): Promise<void>
}
