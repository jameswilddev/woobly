import DisposableBase from "./disposable-base"

export default abstract class InvalidatableBase<TMetadata> extends DisposableBase<TMetadata> {
  async invalidate(
    metadata: TMetadata,
  ): Promise<void> {
    await this.criticalSection.execute(async () => {
      await this.cleanUp()
      await this.generate(metadata)
    })
  }
}
