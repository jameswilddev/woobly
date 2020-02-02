import * as path from "path"
import { determinePurposeOfFilePath } from "./index"
import SearchedPlugin from "./searched-plugin"
import FilePath from "./file-path"
import MapOne from "./map-one"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`determinePurposeOfFilePath`, () => {
    describe(`when plugins are not installed`, () => {
      it(
        `resolves paths which are both valid TypeScript and content`,
        () => expect(determinePurposeOfFilePath([], path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`)))
          .toEqual({
            type: `typeScript`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`),
          }),
      )

      it(
        `resolves paths which are valid TypeScript but not content`,
        () => expect(determinePurposeOfFilePath([], path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`)))
          .toEqual({
            type: `typeScript`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`),
          }),
      )

      it(
        `returns an error for paths which are not valid TypeScript or content`,
        () => expect(determinePurposeOfFilePath([], path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)))
          .toEqual({
            type: `invalid`,
            reason: `Unable to determine the purpose of file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
          }),
      )

      it(
        `returns an error for paths which are valid content for which no plugin is installed`,
        () => expect(determinePurposeOfFilePath([], path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)))
          .toEqual({
            type: `invalid`,
            reason: `No installed plugin handles files with the extension "test-unimplemented-file-extension" (from file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  There are no plugins installed; execute "npm install --save-dev {plugin name}" to install plugins.`,
          }),
      )

      it(
        `resolves paths which are valid applications`,
        () => expect(determinePurposeOfFilePath([], path.join(`src`, `subdirectory-a`, `subdirectory-b`, `valid-app-file.application.json`)))
          .toEqual({
            type: `application`,
            filePath: [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
          }),
      )
    })

    describe(`when plugins are installed`, () => {
      function scenario(
        description: string,
        fileName: string,
        expectedFactory: (plugins: ReadonlyArray<SearchedPlugin>) => MapOne<FilePath>,
      ): void {
        describe(description, () => {
          let expected: MapOne<FilePath>
          let actual: MapOne<FilePath>
          let pluginInstanceA: jasmine.Spy
          let pluginA: SearchedPlugin
          let pluginInstanceB: jasmine.Spy
          let pluginB: SearchedPlugin
          let pluginInstanceC: jasmine.Spy
          let pluginC: SearchedPlugin
          let pluginInstanceD: jasmine.Spy
          let pluginD: SearchedPlugin

          beforeAll(() => {
            pluginInstanceA = jasmine.createSpy(`pluginInstanceA`)
            pluginA = {
              name: `Test Plugin Name A`,
              cacheKeyPrefix: `Test Cache Key Prefix A`,
              fileExtension: `test-file-extension-a`,
              instance: pluginInstanceA,
            }

            pluginInstanceB = jasmine.createSpy(`pluginInstanceB`)
            pluginB = {
              name: `Test Plugin Name B`,
              cacheKeyPrefix: `Test Cache Key Prefix B`,
              fileExtension: `test-file-extension-b`,
              instance: pluginInstanceB,
            }

            pluginInstanceC = jasmine.createSpy(`pluginInstanceC`)
            pluginC = {
              name: `Test Plugin Name C`,
              cacheKeyPrefix: `Test Cache Key Prefix C`,
              fileExtension: `test-file-extension-c`,
              instance: pluginInstanceC,
            }

            pluginInstanceD = jasmine.createSpy(`pluginInstanceD`)
            pluginD = {
              name: `Test Plugin Name D`,
              cacheKeyPrefix: `Test Cache Key Prefix D`,
              fileExtension: `test-file-extension-d`,
              instance: pluginInstanceD,
            }

            const plugins: ReadonlyArray<SearchedPlugin> = [pluginA, pluginB, pluginC, pluginD]

            expected = expectedFactory(plugins)
            actual = determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, fileName))
          })

          it(`returns the expected file path`, () => expect(actual).toEqual(expected))
          it(`does not execute any of the plugins`, () => {
            expect(pluginInstanceA).not.toHaveBeenCalled()
            expect(pluginInstanceB).not.toHaveBeenCalled()
            expect(pluginInstanceC).not.toHaveBeenCalled()
            expect(pluginInstanceD).not.toHaveBeenCalled()
          })
        })
      }

      scenario(
        `paths which are both valid TypeScript and content`,
        `type-script-file-which-is-also-a-valid-content-file-path.ts`,
        () => ({
          type: `typeScript`,
          filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`),
        }),
      )

      scenario(
        `paths which are valid TypeScript but not content`,
        `type-script-file-which-is-also-a-valid-content-file-path!.ts`,
        () => ({
          type: `typeScript`,
          filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`),
        }),
      )

      scenario(
        `returns an error for paths which are not valid TypeScript or content`,
        `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`,
        () => ({
          type: `invalid`,
          reason: `Unable to determine the purpose of file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
        }),
      )

      scenario(
        `returns an error for paths which are valid content for which no plugin is installed`,
        `content-file-with-unimplemented-extension.test-unimplemented-file-extension`,
        () => ({
          type: `invalid`,
          reason: `No installed plugin handles files with the extension "test-unimplemented-file-extension" (from file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  Plugins are installed for the following file extensions: "test-file-extension-a" (from plugin "Test Plugin Name A"), "test-file-extension-b" (from plugin "Test Plugin Name B"), "test-file-extension-c" (from plugin "Test Plugin Name C"), "test-file-extension-d" (from plugin "Test Plugin Name D"); execute "npm install --save-dev {plugin name}" to install plugins.`,
        }),
      )

      scenario(
        `resolves paths which are valid content for which a plugin is installed`,
        `content-file-with-implemented-extension.test-file-extension-b`,
        plugins => ({
          type: `content`,
          filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-implemented-extension.test-file-extension-b`),
          plugin: plugins[1],
          typeScriptIdentifier: `subdirectoryASubdirectoryBContentFileWithImplementedExtension`,
        }),
      )

      scenario(
        `resolves paths which are valid applications`,
        `valid-app-file.application.json`,
        () => ({
          type: `application`,
          filePath: [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
        }),
      )
    })
  })
})
