import { filePathShouldBeProcessed } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`filePathShouldBeProcessed`, () => {
    function accepts(
      description: string,
      filePath: string,
    ): void {
      describe(description, () => {
        it(
          `is accepted as it appears to be a source file`,
          () => expect(filePathShouldBeProcessed(filePath)).toBeTrue()
        )
      })
    }

    function rejects(
      description: string,
      filePath: string,
    ): void {
      describe(description, () => {
        it(
          `is rejected as it appears to be a temporary file or similar`,
          () => expect(filePathShouldBeProcessed(filePath)).toBeFalse()
        )
      })
    }

    accepts(`a filename without an extension`, `src/a-test-filename`)
    accepts(`a filename with one extension`, `src/a-test-filename.with-an-extension`)
    accepts(`a filename with two extensions`, `src/a-test-filename.with.two-extensions`)
    accepts(`a filename with three extensions`, `src/a-test-filename.with.three.extensions`)
    accepts(`a filename in a directory without an extension`, `src/an-example-directory/a-test-filename`)
    accepts(`a filename in a directory with one extension`, `src/an-example-directory/a-test-filename.with-an-extension`)
    accepts(`a filename in a directory with two extensions`, `src/an-example-directory/a-test-filename.with.two-extensions`)
    accepts(`a filename in a directory with three extensions`, `src/an-example-directory/a-test-filename.with.three.extensions`)
    accepts(`a filename nested two directories deep without an extension`, `src/an-example-child-directory/a-test-filename`)
    accepts(`a filename nested two directories deep with one extension`, `src/an-example-child-directory/a-test-filename.with-an-extension`)
    accepts(`a filename nested two directories deep with two extensions`, `src/an-example-child-directory/a-test-filename.with.two-extensions`)
    accepts(`a filename nested two directories deep with three extensions`, `src/an-example-child-directory/a-test-filename.with.three.extensions`)

    rejects(`a filename starting with a dot without an extension`, `src/.a-test-filename`)
    rejects(`a filename starting with a dot with one extension`, `src/.a-test-filename.with-an-extension`)
    rejects(`a filename starting with a dot with two extensions`, `src/.a-test-filename.with.two-extensions`)
    rejects(`a filename starting with a dot with three extensions`, `src/.a-test-filename.with.three.extensions`)
    rejects(`a filename starting with a dot in a directory without an extension`, `src/.an-example-directory/a-test-filename`)
    rejects(`a filename starting with a dot in a directory with one extension`, `src/.an-example-directory/a-test-filename.with-an-extension`)
    rejects(`a filename starting with a dot in a directory with two extensions`, `src/.an-example-directory/a-test-filename.with.two-extensions`)
    rejects(`a filename starting with a dot in a directory with three extensions`, `src/.an-example-directory/a-test-filename.with.three.extensions`)
    rejects(`a filename starting with a dot nested two directories deep without an extension`, `src/an-example-child-directory/.a-test-filename`)
    rejects(`a filename starting with a dot nested two directories deep with one extension`, `src/an-example-child-directory/.a-test-filename.with-an-extension`)
    rejects(`a filename starting with a dot nested two directories deep with two extensions`, `src/an-example-child-directory/.a-test-filename.with.two-extensions`)
    rejects(`a filename starting with a dot nested two directories deep with three extensions`, `src/an-example-child-directory/.a-test-filename.with.three.extensions`)
    rejects(`a filename in a directory starting with a dot without an extension`, `src/.an-example-directory/a-test-filename`)
    rejects(`a filename in a directory starting with a dot with one extension`, `src/.an-example-directory/a-test-filename.with-an-extension`)
    rejects(`a filename in a directory starting with a dot with two extensions`, `src/.an-example-directory/a-test-filename.with.two-extensions`)
    rejects(`a filename in a directory starting with a dot with three extensions`, `src/.an-example-directory/a-test-filename.with.three.extensions`)
    rejects(`a filename in a directory starting with a dot in another directory without an extension`, `src/an-example-child-directory/.a-test-filename`)
    rejects(`a filename in a directory starting with a dot in another directory with one extension`, `src/an-example-child-directory/.a-test-filename.with-an-extension`)
    rejects(`a filename in a directory starting with a dot in another directory with two extensions`, `src/an-example-child-directory/.a-test-filename.with.two-extensions`)
    rejects(`a filename in a directory starting with a dot in another directory with three extensions`, `src/an-example-child-directory/.a-test-filename.with.three.extensions`)
    rejects(`a filename in a directory in a directory starting with a dot without an extension`, `src/.an-example-child-directory/a-test-filename`)
    rejects(`a filename in a directory in a directory starting with a dot with one extension`, `src/.an-example-child-directory/a-test-filename.with-an-extension`)
    rejects(`a filename in a directory in a directory starting with a dot with two extensions`, `src/.an-example-child-directory/a-test-filename.with.two-extensions`)
    rejects(`a filename in a directory in a directory starting with a dot with three extensions`, `src/.an-example-child-directory/a-test-filename.with.three.extensions`)
  })
})
