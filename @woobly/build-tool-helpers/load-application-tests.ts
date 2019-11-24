import * as path from "path"
import { loadApplication } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`loadApplicaion`, () => {
    const originalWorkingDirectory = process.cwd()

    function scenario(
      description: string,
      then: () => void,
    ): void {
      describe(
        description,
        () => {
          beforeAll(() => {
            const temporaryWorkingDirectory = path.join(`test-data`, `load-application`)
            process.chdir(temporaryWorkingDirectory)
          })

          afterAll(() => {
            process.chdir(originalWorkingDirectory)
          })

          then()
        },
      )
    }

    scenario(
      `when the file path is a valid application`,
      () => it(
        `resolves including the type, file path, application sha1, logo sha1 and json`,
        () => expectAsync(loadApplication({
          filePath: [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
        })).toBeResolvedTo({
          logo: {
            filePath: [`path-to`, `valid`, `logo.txt`],
            pixelArt: true,
            backgroundColor: `Test Valid Background Color`,
          },
          application: {
            name: {
              long: `Test Valid Long Name`,
              short: `Test Valid Short Name`,
            },
            description: `Test Valid Description`,
            language: `Test Valid Language`,
            version: `Test Valid Version`,
            color: `Test Valid Color`,
            appleStatusBarStyle: `blackTranslucent`,
            display: `browser`,
            orientation: `natural`,
          },
          developer: {
            name: `Test Valid Developer Name`,
            website: `https://test-developer.com/website`,
          },
        }),
      ),
    )

    scenario(
      `when the file path is an application which does not deserialize`,
      () => it(
        `throws the expected error`,
        () => expectAsync(loadApplication({
          filePath: [`subdirectory-a`, `subdirectory-b`, `non-deserializable-app-file`],
        })).toBeRejectedWithError(
          /^Unexpected string in JSON at position \d+$/,
        ),
      ),
    )

    scenario(
      `when the file path is an application which has validation errors`,
      () => it(
        `throws the expected error`,
        () => expectAsync(loadApplication({
          filePath: [`subdirectory-a`, `subdirectory-b`, `with-validation-errors`],
        })).toBeRejectedWithError(
          `Application JSON "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `with-validation-errors.application.json`)}" is not valid; the following errors were detected:
\tinstance.logo.pixelArt - is not of a type(s) boolean
\tinstance.application.name - requires property "long"
\tinstance.application.display - is not one of enum values: standalone,fullScreen,minimalUi,browser`,
        ),
      ),
    )
  })
})
