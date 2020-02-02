import * as favicons from "favicons"
import generateFaviconsConfiguration from "./generate-favicons-configuration"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`generateFaviconsConfiguration`, () => {
    function scenario(
      description: string,
      pixelArt: boolean,
      appleStatusBarStyle: `default` | `black` | `blackTranslucent`,
      display: `standalone` | `fullScreen` | `minimalUi` | `browser`,
      orientation: `any` | `natural` | `portrait` | `landscape`,
      production: boolean,
      assert: (
        configuration: favicons.Configuration & {
          readonly appShortName: string
          readonly appleStatusBarStyle: `default` | `black` | `black-translucent`
          readonly loadManifestWithCredentials: boolean
        }
      ) => void,
    ): void {
      it(description, () => {
        const application = {
          logo: {
            filePath: [`test`, `file`, `path`],
            pixelArt,
            backgroundColor: `Test Background Color`,
          },
          application: {
            name: {
              long: `Test Long Name`,
              short: `Test Short Name`,
            },
            description: `Test Description`,
            language: `Test Language`,
            version: `Test Version`,
            color: `Test Color`,
            appleStatusBarStyle,
            display,
            orientation,
          },
          developer: {
            name: `Test Developer Name`,
            website: `Test Developer Website`,
          },
        }

        const output = generateFaviconsConfiguration(application, production)

        assert(output)
      })
    }

    scenario(`appName`, false, `default`, `standalone`, `any`, false, r => expect(r.appName).toEqual(`Test Long Name`))
    scenario(`appShortName`, false, `default`, `standalone`, `any`, false, r => expect(r.appShortName).toEqual(`Test Short Name`))
    scenario(`appDescription`, false, `default`, `standalone`, `any`, false, r => expect(r.appDescription).toEqual(`Test Description`))
    scenario(`developerName`, false, `default`, `standalone`, `any`, false, r => expect(r.developerName).toEqual(`Test Developer Name`))
    scenario(`developerURL`, false, `default`, `standalone`, `any`, false, r => expect(r.developerURL).toEqual(`Test Developer Website`))
    scenario(`lang`, false, `default`, `standalone`, `any`, false, r => expect(r.lang).toEqual(`Test Language`))
    scenario(`background`, false, `default`, `standalone`, `any`, false, r => expect(r.background).toEqual(`Test Background Color`))
    scenario(`theme_color`, false, `default`, `standalone`, `any`, false, r => expect(r.theme_color).toEqual(`Test Color`))
    describe(`appleStatusBarStyle`, () => {
      scenario(`default`, false, `default`, `standalone`, `any`, false, r => expect(r.appleStatusBarStyle).toEqual(`default`))
      scenario(`black`, false, `black`, `standalone`, `any`, false, r => expect(r.appleStatusBarStyle).toEqual(`black`))
      scenario(`black translucent`, false, `blackTranslucent`, `standalone`, `any`, false, r => expect(r.appleStatusBarStyle).toEqual(`black-translucent`))
    })
    describe(`display`, () => {
      scenario(`full screen`, false, `default`, `fullScreen`, `any`, false, r => expect(r.display).toEqual(`fullscreen`))
      scenario(`standalone`, false, `default`, `standalone`, `any`, false, r => expect(r.display).toEqual(`standalone`))
      scenario(`minimal ui`, false, `default`, `minimalUi`, `any`, false, r => expect(r.display).toEqual(`minimal-ui`))
      scenario(`browser`, false, `default`, `browser`, `any`, false, r => expect(r.display).toEqual(`browser`))
    })
    describe(`orientation`, () => {
      scenario(`any`, false, `default`, `standalone`, `any`, false, r => expect(r.orientation).toEqual(`any`))
      scenario(`portrait`, false, `default`, `standalone`, `portrait`, false, r => expect(r.orientation).toEqual(`portrait`))
      scenario(`landscape`, false, `default`, `standalone`, `landscape`, false, r => expect(r.orientation).toEqual(`landscape`))
    })
    describe(`pixel art`, () => {
      scenario(`false`, false, `default`, `standalone`, `any`, false, r => expect(r.pixel_art).toEqual(false))
      scenario(`true`, true, `default`, `standalone`, `any`, false, r => expect(r.pixel_art).toEqual(true))
    })
    scenario(`path`, false, `default`, `standalone`, `any`, false, r => expect(r.path).toEqual(``))
    scenario(`dir`, false, `default`, `standalone`, `any`, false, r => expect(r.dir).toEqual(`auto`))
    scenario(`start_url`, false, `default`, `standalone`, `any`, false, r => expect(r.start_url).toEqual(``))
    scenario(`logging`, false, `default`, `standalone`, `any`, false, r => expect(r.logging).toEqual(false))
    scenario(`loadManifestWithCredentials`, false, `default`, `standalone`, `any`, false, r => expect(r.loadManifestWithCredentials).toEqual(false))
    scenario(`scope`, false, `default`, `standalone`, `any`, false, r => expect(r.scope).toEqual(`/`))
    scenario(`pipeHTML`, false, `default`, `standalone`, `any`, false, r => expect(r.pipeHTML).toEqual(false))
    scenario(`manifestRelativePaths`, false, `default`, `standalone`, `any`, false, r => expect(r.manifestRelativePaths).toEqual(false))
    describe(`production`, () => {
      describe(`false`, () => {
        scenario(`android`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.android).toEqual(false))
        scenario(`appleIcon`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.appleIcon).toEqual(false))
        scenario(`appleStartup`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.appleStartup).toEqual(false))
        scenario(`coast`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.coast).toEqual(false))
        scenario(`favicons`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.favicons).toEqual(true))
        scenario(`firefox`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.firefox).toEqual(false))
        scenario(`windows`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.windows).toEqual(false))
        scenario(`yandex`, false, `default`, `standalone`, `any`, false, r => expect(r.icons.yandex).toEqual(false))
      })
      describe(`true`, () => {
        scenario(`android`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.android).toEqual(true))
        scenario(`appleIcon`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.appleIcon).toEqual(true))
        scenario(`appleStartup`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.appleStartup).toEqual(true))
        scenario(`coast`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.coast).toEqual(true))
        scenario(`favicons`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.favicons).toEqual(true))
        scenario(`firefox`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.firefox).toEqual(true))
        scenario(`windows`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.windows).toEqual(true))
        scenario(`yandex`, false, `default`, `standalone`, `any`, true, r => expect(r.icons.yandex).toEqual(true))
      })
    })
  })
})
