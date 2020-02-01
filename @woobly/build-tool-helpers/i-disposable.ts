export default interface IDisposable<TMetadata> {
  initialize(
    metadata: TMetadata,
  ): Promise<void>
  dispose(): Promise<void>
}
