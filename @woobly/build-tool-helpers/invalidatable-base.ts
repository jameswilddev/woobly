import DisposableBase from "./disposable-base"

export default abstract class InvalidatableBase extends DisposableBase {
  async invalidate(): Promise<void> {
    await this.criticalSection.execute(async () => {
      await this.cleanUp()
      await this.generate()
    })
  }
}
