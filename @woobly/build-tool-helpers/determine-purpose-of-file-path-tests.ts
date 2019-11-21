import * as path from "path"
import { determinePurposeOfFilePath } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`determinePurposeOfFilePath`, () => {
    describe(`when plugins are not installed`, () => {
      it(
        `resolves paths which are both valid TypeScript and content`,
        () => expect(determinePurposeOfFilePath({}, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`)))
          .toEqual({
            type: `typeScript`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`),
          }),
      )

      it(
        `resolves paths which are valid TypeScript but not content`,
        () => expect(determinePurposeOfFilePath({}, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`)))
          .toEqual({
            type: `typeScript`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`),
          }),
      )

      it(
        `returns an error for paths which are not valid TypeScript or content`,
        () => expect(determinePurposeOfFilePath({}, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)))
          .toEqual({
            type: `invalid`,
            reason: `Unable to determine the purpose of file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
          }),
      )

      it(
        `returns an error for paths which are valid content for which no plugin is installed`,
        () => expect(determinePurposeOfFilePath({}, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)))
          .toEqual({
            type: `invalid`,
            reason: `No installed plugin handles files with the extension "test-unimplemented-file-extension" (from file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  There are no plugins installed; execute "npm install --save-dev {plugin name}" to install plugins.`,
          }),
      )

      it(
        `resolves paths which are valid applications`,
        () => expect(determinePurposeOfFilePath({}, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `valid-app-file.application.json`)))
          .toEqual({
            type: `application`,
            filePath: [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
          }),
      )
    })

    describe(`when plugins are installed`, () => {
      const plugins: { readonly [fileExtension: string]: string } = {
        "test-file-extension-a": "testPluginB",
        "test-file-extension-b": "testPluginC",
        "test-file-extension-c": "testPluginD",
        "test-file-extension-d": "testPluginA",
      }

      it(
        `resolves paths which are both valid TypeScript and content`,
        () => expect(determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`)))
          .toEqual({
            type: `typeScript`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path.ts`),
          }),
      )

      it(
        `resolves paths which are valid TypeScript but not content`,
        () => expect(determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`)))
          .toEqual({
            type: `typeScript`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `type-script-file-which-is-also-a-valid-content-file-path!.ts`),
          }),
      )

      it(
        `returns an error for paths which are not valid TypeScript or content`,
        () => expect(determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)))
          .toEqual({
            type: `invalid`,
            reason: `Unable to determine the purpose of file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `not-a-type-script-file-and-not-a-valid-content-path!.test-unimplemented-file-extension`)}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`,
          }),
      )

      it(
        `returns an error for paths which are valid content for which no plugin is installed`,
        () => expect(determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)))
          .toEqual({
            type: `invalid`,
            reason: `No installed plugin handles files with the extension "test-unimplemented-file-extension" (from file "${path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-unimplemented-extension.test-unimplemented-file-extension`)}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  Plugins are installed for the following file extensions: "test-file-extension-a" (from plugin "testPluginB"), "test-file-extension-b" (from plugin "testPluginC"), "test-file-extension-c" (from plugin "testPluginD"), "test-file-extension-d" (from plugin "testPluginA"); execute "npm install --save-dev {plugin name}" to install plugins.`,
          }),
      )

      it(
        `resolves paths which are valid content for which a plugin is installed`,
        () => expect(determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-implemented-extension.test-file-extension-b`)))
          .toEqual({
            type: `content`,
            filePath: path.join(`src`, `subdirectory-a`, `subdirectory-b`, `content-file-with-implemented-extension.test-file-extension-b`),
            plugin: `testPluginC`,
            typeScriptIdentifier: `subdirectoryASubdirectoryBContentFileWithImplementedExtension`,
          })
      )

      it(
        `resolves paths which are valid applications`,
        () => expect(determinePurposeOfFilePath(plugins, path.join(`src`, `subdirectory-a`, `subdirectory-b`, `valid-app-file.application.json`)))
          .toEqual({
            type: `application`,
            filePath: [`subdirectory-a`, `subdirectory-b`, `valid-app-file`],
          }),
      )
    })
  })
})
