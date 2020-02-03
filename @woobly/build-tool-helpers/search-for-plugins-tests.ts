import * as path from "path"
import SearchedPlugin from "./searched-plugin"
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
      expected: ReadonlyArray<SearchedPlugin>,
    ): void {
      scenario(description, directory, () => {
        let actual: ReadonlyArray<SearchedPlugin>

        beforeAll(async () => {
          actual = await searchForPlugins()
        })

        it(
          `returns the expected number of plugins`,
          () => expect(actual.length).toEqual(expected.length),
        )

        it(
          `returns the expected cache key prefixes`,
          () => expected
            .slice(0, Math.min(expected.length, actual.length))
            .forEach((expected, i) => expect(actual[i].cacheKeyPrefix).toEqual(expected.cacheKeyPrefix)),
        )

        it(
          `returns the expected file extensions`,
          () => expected
            .slice(0, Math.min(expected.length, actual.length))
            .forEach((expected, i) => expect(actual[i].fileExtension).toEqual(expected.fileExtension)),
        )

        it(
          `returns the expected instances`,
          () => expected
            .slice(0, Math.min(expected.length, actual.length))
            .forEach((expected, i) => expect(actual[i].instance).toBe(expected.instance)),
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

    resolves(`with plugins`, `with-plugins`, [{
      name: `@pretend-scope/pretend-plugin-d`,
      cacheKeyPrefix: `pretend-scope@pretend-plugin-d@Test Pretend Plugin D Version`,
      fileExtension: `test.file.extension.d`,
      instance: require(path.join(__dirname, `..`, `..`, `test-data`, `search-for-plugins`, `with-plugins`, `node_modules`, `@pretend-scope`, `pretend-plugin-d`)),
    }, {
      name: `pretend-plugin-a`,
      cacheKeyPrefix: `pretend-plugin-a@Test Pretend Plugin A Version`,
      fileExtension: `test.file.extension.a`,
      instance: require(path.join(__dirname, `..`, `..`, `test-data`, `search-for-plugins`, `with-plugins`, `node_modules`, `pretend-plugin-a`)),
    }, {
      name: `pretend-plugin-b`,
      cacheKeyPrefix: `pretend-plugin-b@Test Pretend Plugin B Version`,
      fileExtension: `test.file.extension.b`,
      instance: require(path.join(__dirname, `..`, `..`, `test-data`, `search-for-plugins`, `with-plugins`, `node_modules`, `pretend-plugin-b`)),
    }, {
      name: `pretend-plugin-c`,
      cacheKeyPrefix: `pretend-plugin-c@Test Pretend Plugin C Version`,
      fileExtension: `test.file.extension.c`,
      instance: require(path.join(__dirname, `..`, `..`, `test-data`, `search-for-plugins`, `with-plugins`, `node_modules`, `pretend-plugin-c`)),
    }])

    resolves(`without plugins`, `without-plugins`, [])

    rejects(`node_modules missing`, `node-modules-missing`, `The "node_modules" directory is missing.  Please ensure that dependencies have been installed (execute "npm install").`)
    rejects(`dependency missing`, `dependency-missing`, `Dependency "non-plugin-c" is missing from the "node_modules" directory.  Please ensure that dependencies have been installed (execute "npm install").`)
    rejects(`dependency missing package.json`, `dependency-missing-package-json`, `Dependency "non-plugin-c" is missing its "package.json" file.  Please ensure that dependencies have been installed (execute "npm install").`)
    rejects(`unexpected error reading dependency package.json`, `unexpected-error-reading-dependency-package-json`, `EISDIR: illegal operation on a directory, read`)
    rejects(`file extension collision`, `file-extension-collision`, `Plugins "pretend-plugin-a" and "pretend-plugin-c" are in conflict with regards to file extension "test.file.extension.a".  Please ensure that no two plugins handle the same file extension.`)
  })
})
