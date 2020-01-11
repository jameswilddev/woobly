export default interface IDisposable {
  initialize(): Promise<void>
  dispose(): Promise<void>
}
