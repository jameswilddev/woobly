import * as path from "path"
import { searchForPlugins } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`searchForPlugins`, () => {
    const originalWorkingDirectory = process.cwd()

    function scenario(
      description: string,
      directory: string,
      then: () => void,
    ): void {
      describe(description, () => {
        beforeAll(() => {
          const temporaryWorkingDirectory = path.join(`test-data`, `search-for-plugins`, directory)
          process.chdir(temporaryWorkingDirectory)
        })

        afterAll(() => {
          process.chdir(originalWorkingDirectory)
        })

        then()
      })
    }

    function resolves(
      description: string,
      directory: string,
      plugins: { readonly [fileExtension: string]: string },
    ): void {
      scenario(description, directory, () => {
        it(
          `resolves with the expected map of file extensions to plugins`,
          () => expectAsync(searchForPlugins()).toBeResolvedTo(plugins)
        )
      })
    }

    function rejects(
      description: string,
      directory: string,
      reason: string,
    ): void {
      scenario(description, directory, () => {
        it(
          `rejects with the expected reason`,
          () => expectAsync(searchForPlugins()).toBeRejectedWith(new Error(reason))
        )
      })
    }

    resolves(`with plugins`, `with-plugins`, {
      "test.file.extension.a": `pretend-plugin-a`,
      "test.file.extension.b": `pretend-plugin-b`,
      "test.file.extension.c": `pretend-plugin-c`,
    })

    resolves(`without plugins`, `without-plugins`, {})

    resolves(`without dependencies`, `without-dependencies`, {})

    rejects(`no package.json`, `no-package-json`, `Failed to find the "package.json" file.  Please ensure that the current working directory is the root of the project.`)
    rejects(`unexpected error reading package.json`, `unexpected-error-reading-package-json`, `EISDIR: illegal operation on a directory, read`)
    rejects(`node_modules missing`, `node-modules-missing`, `The "node_modules" directory is missing.  Please ensure that dependencies have been installed (execute "npm install").`)
    rejects(`dependency missing`, `dependency-missing`, `Dependency "non-plugin-c" is missing from the "node_modules" directory.  Please ensure that dependencies have been installed (execute "npm install").`)
    rejects(`dependency missing package.json`, `dependency-missing-package-json`, `Dependency "non-plugin-c" is missing its "package.json" file.  Please ensure that dependencies have been installed (execute "npm install").`)
    rejects(`unexpected error reading dependency package.json`, `unexpected-error-reading-dependency-package-json`, `EISDIR: illegal operation on a directory, read`)
    rejects(`file extension collision`, `file-extension-collision`, `Plugins "pretend-plugin-a" and "pretend-plugin-c" are in conflict with regards to file extension "test.file.extension.a".  Please ensure that no two plugins handle the same file extension.`)
  })
})
