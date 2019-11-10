import * as path from "path"
import listAllDependencies from "./list-all-dependencies"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`listAllDependencies`, () => {
    const originalWorkingDirectory = process.cwd()

    function scenario(
      description: string,
      directory: string,
      then: () => void,
    ): void {
      describe(description, () => {
        beforeAll(() => {
          const temporaryWorkingDirectory = path.join(`test-data`, `list-all-dependencies`, directory)
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
      dependencies: ReadonlyArray<string>,
    ): void {
      scenario(description, directory, () => {
        it(
          `resolves with the expected list of dependencies`,
          () => expectAsync(listAllDependencies()).toBeResolvedTo(dependencies)
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
          () => expectAsync(listAllDependencies()).toBeRejectedWith(new Error(reason))
        )
      })
    }

    resolves(`without dependencies without devDependencies`, `without-dependencies-without-dev-dependencies`, [])

    resolves(
      `with dependencies without devDependencies`,
      `with-dependencies-without-dev-dependencies`,
      [`test-a-dependency`, `test-b-dependency`, `test-c-dependency`],
    )

    resolves(
      `without dependencies with devDependencies`,
      `without-dependencies-with-dev-dependencies`,
      [`test-a-dev-dependency`, `test-b-dev-dependency`, `test-c-dev-dependency`],
    )

    resolves(
      `with dependencies with devDependencies`,
      `with-dependencies-with-dev-dependencies`,
      [`test-a-dependency`, `test-b-dev-dependency`, `test-c-common-dependency`, `test-d-dependency`, `test-e-dev-dependency`],
    )

    rejects(`no package.json`, `no-package-json`, `Failed to find the "package.json" file.  Please ensure that the current working directory is the root of the project.`)
    rejects(`unexpected error reading package.json`, `unexpected-error-reading-package-json`, `EISDIR: illegal operation on a directory, read`)
  })
})
