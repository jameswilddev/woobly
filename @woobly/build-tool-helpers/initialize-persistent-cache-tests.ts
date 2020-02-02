import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import { initializePersistentCache } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`invalidatePersistentCache`, () => {
    describe(`when the target directory does not exist`, () => {
      let baseDirectory: string
      let result: ReadonlyArray<string>

      beforeAll(async () => {
        baseDirectory = await fs.promises.mkdtemp(
          path.join(os.tmpdir(), `woobly-build-tool-helpers-invalidate-persistent-cache-non-empty`)
        )
        await fs.promises.mkdir(path.join(baseDirectory, `other-a`, `other-b`), { recursive: true })
        await fs.promises.writeFile(path.join(baseDirectory, `other-a`, `other-b`, `other-c`), `other`)
        const originalWorkingDirectory = process.cwd()
        process.chdir(baseDirectory)
        result = await initializePersistentCache([`base-a`, `base-b`], `expected-file-name`)
        process.chdir(originalWorkingDirectory)
      })

      it(`returns an empty array`, () => expect(result).toEqual([]))
      describe(`the target directory`, () => {
        it(`is created`, async () => {
          try {
            const stats = await fs.promises.stat(path.join(baseDirectory, `base-a`, `base-b`))
            expect(stats.isDirectory()).toBeTrue()
          } catch (e) {
            fail(e)
          }
        })
        it(`is empty`, async () => {
          const content = await fs.promises.readdir(path.join(baseDirectory, `base-a`, `base-b`))
          expect(content).toEqual([])
        })
      })
      it(`does not modify other files`, async () => {
        const joinedPath = path.join(baseDirectory, `other-a`, `other-b`, `other-c`)
        const content = await fs.promises.readFile(joinedPath, `utf8`)
        expect(content).toEqual(`other`)
      })
    })

    describe(`when the target directory exists and is empty`, () => {
      let baseDirectory: string
      let result: ReadonlyArray<string>

      beforeAll(async () => {
        baseDirectory = await fs.promises.mkdtemp(
          path.join(os.tmpdir(), `woobly-build-tool-helpers-invalidate-persistent-cache-non-empty`)
        )
        await fs.promises.mkdir(path.join(baseDirectory, `other-a`, `other-b`), { recursive: true })
        await fs.promises.writeFile(path.join(baseDirectory, `other-a`, `other-b`, `other-c`), `other`)
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`), { recursive: true })
        const originalWorkingDirectory = process.cwd()
        process.chdir(baseDirectory)
        result = await initializePersistentCache([`base-a`, `base-b`], `expected-file-name`)
        process.chdir(originalWorkingDirectory)
      })

      it(`returns an empty array`, () => expect(result).toEqual([]))
      describe(`the target directory`, () => {
        it(`remains present`, async () => {
          try {
            const stats = await fs.promises.stat(path.join(baseDirectory, `base-a`, `base-b`))
            expect(stats.isDirectory()).toBeTrue()
          } catch (e) {
            fail(e)
          }
        })
        it(`is empty`, async () => {
          const content = await fs.promises.readdir(path.join(baseDirectory, `base-a`, `base-b`))
          expect(content).toEqual([])
        })
      })
      it(`does not modify other files`, async () => {
        const joinedPath = path.join(baseDirectory, `other-a`, `other-b`, `other-c`)
        const content = await fs.promises.readFile(joinedPath, `utf8`)
        expect(content).toEqual(`other`)
      })
    })

    describe(`when the target directory exists and is not empty`, () => {
      let baseDirectory: string
      let result: ReadonlyArray<string>

      beforeAll(async () => {
        baseDirectory = await fs.promises.mkdtemp(
          path.join(os.tmpdir(), `woobly-build-tool-helpers-invalidate-persistent-cache-non-empty`)
        )
        await fs.promises.mkdir(path.join(baseDirectory, `other-a`, `other-b`), { recursive: true })
        await fs.promises.writeFile(path.join(baseDirectory, `other-a`, `other-b`, `other-c`), `other`)
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `empty-directory`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `directory-which-is-not-empty-but-does-not-contain-the-expected-file`, `non-empty-subdirectory`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `directory-which-is-not-empty-but-does-not-contain-the-expected-file`, `empty-subdirectory`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-a`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-b`, `empty-subdirectory`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-b`, `non-empty-subdirectory`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-c`), { recursive: true })
        await fs.promises.mkdir(path.join(baseDirectory, `base-a`, `base-b`, `directory-which-contains-a-directory-in-place-of-the-expected-file`, `expected-file-name`), { recursive: true })
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `directory-which-is-not-empty-but-does-not-contain-the-expected-file`, `non-empty-subdirectory`, `file-in-non-empty-subdirectory`), `content of file in non-empty subdirectory`)
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `directory-which-is-not-empty-but-does-not-contain-the-expected-file`, `file-which-is-not-expected`), `content of file which is not expected`)
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-a`, `expected-file-name`), `content of valid key a's valid file`)
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-b`, `non-empty-subdirectory`, `file`), `content of valid key b's file in a non-empty subdirectory`)
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-b`, `other-file`), `content of valid key b's other file`)
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-b`, `expected-file-name`), `content of valid key b's valid file`)
        await fs.promises.writeFile(path.join(baseDirectory, `base-a`, `base-b`, `valid-key-c`, `expected-file-name`), `content of valid key c's valid file`)
        const originalWorkingDirectory = process.cwd()
        process.chdir(baseDirectory)
        result = await initializePersistentCache([`base-a`, `base-b`], `expected-file-name`)
        process.chdir(originalWorkingDirectory)
      })

      afterAll(async () => {
        await fs.promises.rmdir(baseDirectory, { recursive: true })
      })

      it(`leaves only the files and directories which are expected`, async () => {
        const actualFiles: string[] = []

        async function recurse(prefix: string, outputPrefix: string): Promise<void> {
          try {
            for (const child of await fs.promises.readdir(prefix)) {
              const combined = path.join(outputPrefix, child)
              actualFiles.push(combined)
              await recurse(path.join(prefix, child), combined)
            }
          } catch (e) {
            if (e.code === `ENOTDIR`) {
              return
            }

            throw e
          }
        }

        await recurse(baseDirectory, ``)

        const expectedFiles = [
          [`other-a`],
          [`other-a`, `other-b`],
          [`other-a`, `other-b`, `other-c`],
          [`base-a`],
          [`base-a`, `base-b`],
          [`base-a`, `base-b`, `valid-key-a`],
          [`base-a`, `base-b`, `valid-key-a`, `expected-file-name`],
          [`base-a`, `base-b`, `valid-key-b`],
          [`base-a`, `base-b`, `valid-key-b`, `expected-file-name`],
          [`base-a`, `base-b`, `valid-key-b`, `other-file`],
          [`base-a`, `base-b`, `valid-key-b`, `empty-subdirectory`],
          [`base-a`, `base-b`, `valid-key-b`, `non-empty-subdirectory`],
          [`base-a`, `base-b`, `valid-key-b`, `non-empty-subdirectory`, `file`],
          [`base-a`, `base-b`, `valid-key-c`],
          [`base-a`, `base-b`, `valid-key-c`, `expected-file-name`],
        ].map(segments => path.join.apply(path, segments))

        actualFiles.forEach(file => expect(expectedFiles).toContain(file))
      })

      it(`does not change any file contents`, async () => {
        const files = [{
          path: [`other-a`, `other-b`, `other-c`],
          content: `other`,
        }, {
          path: [`base-a`, `base-b`, `valid-key-a`, `expected-file-name`],
          content: `content of valid key a's valid file`,
        }, {
          path: [`base-a`, `base-b`, `valid-key-b`, `non-empty-subdirectory`, `file`],
          content: `content of valid key b's file in a non-empty subdirectory`,
        }, {
          path: [`base-a`, `base-b`, `valid-key-b`, `other-file`],
          content: `content of valid key b's other file`,
        }, {
          path: [`base-a`, `base-b`, `valid-key-b`, `expected-file-name`],
          content: `content of valid key b's valid file`,
        }, {
          path: [`base-a`, `base-b`, `valid-key-c`, `expected-file-name`],
          content: `content of valid key c's valid file`,
        }]

        for (const file of files) {
          const joinedPath = path.join.apply(path, [baseDirectory].concat(file.path))
          const content = await fs.promises.readFile(joinedPath, `utf8`)
          expect(content).toEqual(file.content)
        }
      })

      it(`returns all valid directory names`, () => {
        [`valid-key-a`, `valid-key-b`, `valid-key-c`].forEach(key => expect(result).toContain(key))
      })

      it(`does not return anything else`, () => {
        result.forEach(key => expect([`valid-key-a`, `valid-key-b`, `valid-key-c`]).toContain(key))
      })
    })
  })
})
