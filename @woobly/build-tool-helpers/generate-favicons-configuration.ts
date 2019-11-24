import * as favicons from "favicons"
import Application from "./application"

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
  application: Application,
  production: boolean,
): favicons.Configuration & {
  readonly appShortName: string
  readonly appleStatusBarStyle: `default` | `black` | `black-translucent`
  readonly loadManifestWithCredentials: boolean
} {
  return {
    appName: application.application.name.long,
    appShortName: application.application.name.short,
    appDescription: application.application.description,
    developerName: application.developer.name,
    developerURL: application.developer.website,
    lang: application.application.language,
    background: application.logo.backgroundColor,
    theme_color: application.application.color,
    appleStatusBarStyle: convertAppleStatusBarStyle(application.application.appleStatusBarStyle),
    display: convertDisplay(application.application.display),
    orientation: convertOrientation(application.application.orientation),
    version: application.application.version,
    pixel_art: application.logo.pixelArt,
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
