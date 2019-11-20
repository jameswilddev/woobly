export default interface ICriticalSection {
  execute(
    callback: () => Promise<void>,
  ): Promise<void>
}
