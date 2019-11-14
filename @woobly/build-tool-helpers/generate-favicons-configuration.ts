import * as favicons from "favicons"

function convertAppleStatusBarStyle(
  fromJson: `default` | `black` | `blackTranslucent`,
): `default` | `black` | `black-translucent` {
  switch (fromJson) {
    case `default`:
      return `default`
    case `black`:
      return `black`
    case `blackTranslucent`:
      return `black-translucent`
  }
}

function convertDisplay(
  fromJson: `fullScreen` | `standalone` | `minimalUi` | `browser`,
): `fullscreen` | `standalone` | `minimal-ui` | `browser` {
  switch (fromJson) {
    case `fullScreen`:
      return `fullscreen`
    case `standalone`:
      return `standalone`
    case `minimalUi`:
      return `minimal-ui`
    case `browser`:
      return `browser`
  }
}

function convertOrientation(
  fromJson: `any` | `natural` | `portrait` | `landscape`,
): `any` | `natural` | `portrait` | `landscape` {
  return fromJson
}

export default function (
  json: {
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
  },
  production: boolean,
): favicons.Configuration & {
  readonly appShortName: string
  readonly appleStatusBarStyle: `default` | `black` | `black-translucent`
  readonly loadManifestWithCredentials: boolean
} {
  return {
    appName: json.application.name.long,
    appShortName: json.application.name.short,
    appDescription: json.application.description,
    developerName: json.developer.name,
    developerURL: json.developer.website,
    lang: json.application.language,
    background: json.logo.backgroundColor,
    theme_color: json.application.color,
    appleStatusBarStyle: convertAppleStatusBarStyle(json.application.appleStatusBarStyle),
    display: convertDisplay(json.application.display),
    orientation: convertOrientation(json.application.orientation),
    version: json.application.version,
    pixel_art: json.logo.pixelArt,
    path: ``,
    dir: `auto`,
    start_url: ``,
    logging: false,
    loadManifestWithCredentials: false,
    icons: {
      android: production,
      appleIcon: production,
      appleStartup: production,
      coast: production,
      favicons: true,
      firefox: production,
      windows: production,
      yandex: production,
    }
  }
}
