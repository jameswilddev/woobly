import * as path from "path"
import { determinePurposeOfFilePath } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`determinePurposeOfFilePath`, () => {
    const originalWorkingDirectory = process.cwd()

    const filePathPrefix = path.join(`src`, `subdirectory-a`, `subdirectory-b`)

    function scenario(
      description: string,
      filePath: string,
      then: (filePath: string) => void,
    ): void {
      describe(
        description,
        () => {
          beforeAll(() => {
            const temporaryWorkingDirectory = path.join(`test-data`, `determine-purpose-of-file-path`)
            process.chdir(temporaryWorkingDirectory)
          })

          afterAll(() => {
            process.chdir(originalWorkingDirectory)
          })

          then(path.join(filePathPrefix, filePath))
        },
      )
    }

    function resolvesTypeScript(
      description: string,
      filePath: string,
      plugins: { readonly [fileExtension: string]: string },
    ): void {
      scenario(
        description,
        filePath,
        filePath => {
          it(
            `resolves including the type and file path`,
            () => expectAsync(determinePurposeOfFilePath(plugins, filePath))
              .toBeResolvedTo({
                type: `typeScript`,
                filePath,
              })
          )
        }
      )
    }

    function resolvesContent(
      description: string,
      filePath: string,
      plugins: { readonly [fileExtension: string]: string },
      plugin: string,
      typeScriptIdentifier: string,
      sha1: string,
    ): void {
      scenario(
        description,
        filePath,
        filePath => {
          it(
            `resolves including the type, file path, plugin and sha1`,
            () => expectAsync(determinePurposeOfFilePath(plugins, filePath))
              .toBeResolvedTo({
                type: `content`,
                filePath,
                plugin,
                typeScriptIdentifier,
                sha1,
              })
          )
        }
      )
    }

    function resolvesApplication(
      description: string,
      filePath: string,
      plugins: { readonly [fileExtension: string]: string },
      processedFilePath: ReadonlyArray<string>,
      sha1: string,
      logoSha1: string,
      json: any,
    ): void {
      scenario(
        description,
        filePath,
        filePath => {
          it(
            `resolves including the type, file path, application sha1, logo sha1 and json`,
            () => expectAsync(determinePurposeOfFilePath(plugins, filePath))
              .toBeResolvedTo({
                type: `application`,
                filePath: processedFilePath,
                sha1,
                logoSha1,
                json,
              })
          )
        }
      )
    }

    function rejects(
      description: string,
      filePath: string,
      plugins: { readonly [fileExtension: string]: string },
      messageFactory: (filePath: string) => string,
    ): void {
      scenario(
        description,
        filePath,
        filePath => {
          it(
            `resolves including the type, file path, plugin and sha1`,
            () => expectAsync(determinePurposeOfFilePath(plugins, filePath))
              .toBeRejectedWith(new Error(messageFactory(filePath)))
          )
        }
      )
    }

    describe(`when plugins are not installed`, () => {
      resolvesTypeScript(
        `when the file path is a TypeScript file which would also be a valid content file path`,
        `type-script-file-which-is-also-a-valid-content-file-path.ts`,
        {},
      )

      resolvesTypeScript(
        `when the file path is a TypeScript file which would not also be a valid content path`,
        `type-script-file-which-is-not-also-a-valid-content-file-path!.ts`,
        {},
      )

      rejects(
        `when the file path is not a TypeScript file and is not a valid content path`,
        `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`,
        {},
        filePath => `Unable to determine the purpose of file "${filePath}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
      )

      rejects(
        `when the file path is a valid content path`,
        `content-file-with-unimplemented-extension.test-unimplemented-file-extension`,
        {},
        filePath => `No installed plugin handles files with the extension "test-unimplemented-file-extension" (from file "${filePath}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  There are no plugins installed; execute "npm install --save-dev {plugin name}" to install plugins.`
      )

      resolvesApplication(
        `when the file path is a valid application`,
        `valid-app-file.application.json`,
        {},
        [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
        `8edecef5ef36faa0729a5b4d1c80936bbc37fa35`,
        `f8ba41cae9af739e1bacb60a01b6586df0ef638a`,
        {
          entry: `testValidApplication`,
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
        },
      )

      rejects(
        `when the file path is an application which does not deserialize`,
        `non-deserializable-app-file.application.json`,
        {},
        () => `Unexpected string in JSON at position 215`
      )

      rejects(
        `when the file path is an application which has validation errors`,
        `app-file-with-validation-errors.application.json`,
        {},
        filePath => `Application JSON "${filePath}" is not valid; the following errors were detected:
\tinstance.logo.pixelArt - is not of a type(s) boolean
\tinstance.application.name - requires property "long"
\tinstance.application.display - is not one of enum values: standalone,fullScreen,minimalUi,browser`
      )

      rejects(
        `when the file path is an application which has a missing logo`,
        `app-file-with-missing-logo.application.json`,
        {},
        () => `ENOENT: no such file or directory, open '${path.join(`path-to`, `missing`, `logo.txt`)}'`,
      )

      rejects(
        `when the file path is an application which has validation errors and a missing logo file`,
        `app-file-with-validation-errors-and-missing-logo.application.json`,
        {},
        filePath => `Application JSON "${filePath}" is not valid; the following errors were detected:
\tinstance.logo.pixelArt - is not of a type(s) boolean
\tinstance.application.name - requires property "long"
\tinstance.application.display - is not one of enum values: standalone,fullScreen,minimalUi,browser`
      )
    })

    describe(`when plugins are installed`, () => {
      const plugins: { readonly [fileExtension: string]: string } = {
        "test-file-extension-a": "testPluginB",
        "test-file-extension-b": "testPluginC",
        "test-file-extension-c": "testPluginD",
        "test-file-extension-d": "testPluginA",
      }

      resolvesTypeScript(
        `when the file path is a TypeScript file which would also be a valid content file path`,
        `type-script-file-which-is-also-a-valid-content-file-path.ts`,
        plugins,
      )

      resolvesTypeScript(
        `when the file path is a TypeScript file which would not also be a valid content path`,
        `type-script-file-which-is-not-also-a-valid-content-file-path!.ts`,
        plugins,
      )

      rejects(
        `when the file path is not a TypeScript file and is not a valid content path`,
        `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`,
        plugins,
        filePath => `Unable to determine the purpose of file "${filePath}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
      )

      rejects(
        `when the file path is a valid content path but no plugin handles its file extension`,
        `content-file-with-unimplemented-extension.test-unimplemented-file-extension`,
        plugins,
        filePath => `No installed plugin handles files with the extension "test-unimplemented-file-extension" (from file "${filePath}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  Plugins are installed for the following file extensions: "test-file-extension-a" (from plugin "testPluginB"), "test-file-extension-b" (from plugin "testPluginC"), "test-file-extension-c" (from plugin "testPluginD"), "test-file-extension-d" (from plugin "testPluginA"); execute "npm install --save-dev {plugin name}" to install plugins.`
      )

      resolvesContent(
        `when the file path is a valid content path and a plugin handles its file extension`,
        `content-file-with-implemented-extension.test-file-extension-b`,
        plugins,
        `testPluginC`,
        `subdirectoryASubdirectoryBContentFileWithImplementedExtension`,
        `a11d03065c30133aaabe7118db64adee9da30606`,
      )

      resolvesApplication(
        `when the file path is a valid application`,
        `valid-app-file.application.json`,
        plugins,
        [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
        `8edecef5ef36faa0729a5b4d1c80936bbc37fa35`,
        `f8ba41cae9af739e1bacb60a01b6586df0ef638a`,
        {
          entry: `testValidApplication`,
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
        },
      )

      rejects(
        `when the file path is an application which does not deserialize`,
        `non-deserializable-app-file.application.json`,
        plugins,
        () => `Unexpected string in JSON at position 215`
      )

      rejects(
        `when the file path is an application which has a missing logo`,
        `app-file-with-missing-logo.application.json`,
        plugins,
        () => `ENOENT: no such file or directory, open '${path.join(`path-to`, `missing`, `logo.txt`)}'`,
      )

      rejects(
        `when the file path is an application which has validation errors`,
        `app-file-with-validation-errors.application.json`,
        plugins,
        filePath => `Application JSON "${filePath}" is not valid; the following errors were detected:
\tinstance.logo.pixelArt - is not of a type(s) boolean
\tinstance.application.name - requires property "long"
\tinstance.application.display - is not one of enum values: standalone,fullScreen,minimalUi,browser`
      )

      rejects(
        `when the file path is an application which has validation errors and a missing logo file`,
        `app-file-with-validation-errors-and-missing-logo.application.json`,
        plugins,
        filePath => `Application JSON "${filePath}" is not valid; the following errors were detected:
\tinstance.logo.pixelArt - is not of a type(s) boolean
\tinstance.application.name - requires property "long"
\tinstance.application.display - is not one of enum values: standalone,fullScreen,minimalUi,browser`
      )
    })
  })
})
