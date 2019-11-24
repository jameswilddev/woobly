type Application = {
  readonly logo: {
    readonly filePath: ReadonlyArray<string>
    readonly pixelArt: boolean
    readonly backgroundColor: string
  }
  readonly application: {
    readonly name: {
      readonly long: string
      readonly short: string
    }
    readonly description: string
    readonly language: string
    readonly version: string
    readonly color: string
    readonly appleStatusBarStyle: `default` | `black` | `blackTranslucent`
    readonly display: `standalone` | `fullScreen` | `minimalUi` | `browser`
    readonly orientation: `any` | `natural` | `portrait` | `landscape`
  }
  readonly developer: {
    readonly name: string
    readonly website: string
  }
}

export default Application
