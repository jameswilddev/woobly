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
    })
  })
})
