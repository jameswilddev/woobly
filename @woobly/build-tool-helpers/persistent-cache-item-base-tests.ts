import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import { PersistentCacheItemBase } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`PersistentCacheItemBase`, () => {
    describe(`when no operations are performed`, () => {
      class MockPersistentCacheItem extends PersistentCacheItemBase {
        async performGenerate(): Promise<void> {
        }
      }

      let cacheItem: MockPersistentCacheItem

      beforeAll(async () => {
        cacheItem = new MockPersistentCacheItem(
          [`root-directory`, `subdirectory-a`, `subdirectory-b`],
          `test-cache-key`,
          `test-last-file-written`,
        )
      })

      describe(`pathToKeyDirectory`, () => {
        it(`is the path to the key directory`, () => expect(cacheItem.pathToKeyDirectory)
          .toEqual(path.join(`root-directory`, `subdirectory-a`, `subdirectory-b`, `test-cache-key`)))
      })
      describe(`pathToLastFileWritten`, () => {
        it(`is the path to the last file written`, () => expect(cacheItem.pathToLastFileWritten)
          .toEqual(path.join(`root-directory`, `subdirectory-a`, `subdirectory-b`, `test-cache-key`, `test-last-file-written`)))
      })
    })

    describe(`when the cache key does not exist`, () => {
      describe(`generate`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        let directoryExistedAtTimeOfCallingPerformGenerate: null | boolean = null

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            directoryExistedAtTimeOfCallingPerformGenerate = (await fs.promises.stat(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`))).isDirectory()
            await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-subdirectory`), { recursive: true })
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-file-h`), `test file h content`)
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-subdirectory`, `test-file-i`), `test file i content`)
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-last-file-written`), `test file j content`)
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-nonexistent-cache-key`,
            `test-last-file-written`,
          )

          await cacheItem.generate()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`calls performGenerate once`, () => expect(performGenerate).toHaveBeenCalledTimes(1))
        it(`has created the base path by the time of calling performGenerate`, () => expect(directoryExistedAtTimeOfCallingPerformGenerate).toBeTruthy())
        it(`does not modify created files after performGenerate`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-file-h`), `utf8`)).toEqual(`test file h content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-subdirectory`, `test-file-i`), `utf8`)).toEqual(`test file i content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`, `test-last-file-written`), `utf8`)).toEqual(`test file j content`)
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `utf8`)).toEqual(`test file a content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `utf8`)).toEqual(`test file b content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `utf8`)).toEqual(`test file f content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `utf8`)).toEqual(`test file g content`)
        })
      })

      describe(`cleanUp`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-nonexistent-cache-key`,
            `test-last-file-written`,
          )

          await cacheItem.dispose()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`does not call performGenerate`, () => expect(performGenerate).not.toHaveBeenCalledWith())
        it(`does not create the base path`, async () => {
          try {
            await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-nonexistent-cache-key`))
            fail()
          } catch (e) {
            expect(e.code).toEqual(`ENOENT`)
          }
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `utf8`)).toEqual(`test file a content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `utf8`)).toEqual(`test file b content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `utf8`)).toEqual(`test file f content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `utf8`)).toEqual(`test file g content`)
        })
      })
    })

    describe(`when the cache key exists without the last written file`, () => {
      describe(`generate`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        let directoryExistedAtTimeOfCallingPerformGenerate: null | boolean = null
        let directoryWasClearedAtTimeOfCallingPerformGenerate: null | boolean = null

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            directoryExistedAtTimeOfCallingPerformGenerate = (await fs.promises.stat(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`))).isDirectory()

            directoryWasClearedAtTimeOfCallingPerformGenerate = true

            try {
              await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`))
              directoryWasClearedAtTimeOfCallingPerformGenerate = false
            } catch (e) {
              if (e.code !== `ENOENT`) {
                directoryWasClearedAtTimeOfCallingPerformGenerate = false
              }
            }

            try {
              await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`))
              directoryWasClearedAtTimeOfCallingPerformGenerate = false
            } catch (e) {
              if (e.code !== `ENOENT`) {
                directoryWasClearedAtTimeOfCallingPerformGenerate = false
              }
            }

            await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-h`), `test file h content`)
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-i`), `test file i content`)
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-last-file-written`), `test file j content`)
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-cache-key-without-last-file-written`,
            `test-last-file-written`,
          )

          await cacheItem.generate()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`calls performGenerate once`, () => expect(performGenerate).toHaveBeenCalledTimes(1))
        it(`has recreated the base path by the time of calling performGenerate`, () => expect(directoryExistedAtTimeOfCallingPerformGenerate).toBeTruthy())
        it(`has deleted existing files by the time of calling performGenerate`, () => expect(directoryWasClearedAtTimeOfCallingPerformGenerate).toBeTruthy())
        it(`does not modify created files after performGenerate`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-h`), `utf8`)).toEqual(`test file h content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-i`), `utf8`)).toEqual(`test file i content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file j content`)
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `utf8`)).toEqual(`test file f content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `utf8`)).toEqual(`test file g content`)
        })
      })

      describe(`cleanUp`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-cache-key-without-last-file-written`,
            `test-last-file-written`,
          )

          await cacheItem.dispose()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`does not call performGenerate`, () => expect(performGenerate).not.toHaveBeenCalledWith())
        it(`deletes the base path`, async () => {
          try {
            await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`))
            fail()
          } catch (e) {
            expect(e.code).toEqual(`ENOENT`)
          }
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `utf8`)).toEqual(`test file f content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `utf8`)).toEqual(`test file g content`)
        })
      })
    })

    describe(`when the cache key exists with the last written file`, () => {
      describe(`generate`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-cache-key-with-last-file-written`,
            `test-last-file-written`,
          )

          await cacheItem.generate()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`does not call performGenerate`, () => expect(performGenerate).not.toHaveBeenCalledWith())
        it(`does not modify the relevant cache`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `utf8`)).toEqual(`test file a content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `utf8`)).toEqual(`test file b content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `utf8`)).toEqual(`test file f content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `utf8`)).toEqual(`test file g content`)
        })
      })

      describe(`cleanUp`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-cache-key-with-last-file-written`,
            `test-last-file-written`,
          )

          await cacheItem.dispose()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`does not call performGenerate`, () => expect(performGenerate).not.toHaveBeenCalledWith())
        it(`deletes the base path`, async () => {
          try {
            await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`))
            fail()
          } catch (e) {
            expect(e.code).toEqual(`ENOENT`)
          }
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `utf8`)).toEqual(`test file a content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `utf8`)).toEqual(`test file b content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `utf8`)).toEqual(`test file f content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `utf8`)).toEqual(`test file g content`)
        })
      })
    })

    describe(`when the cache key exists with the last written file as a directory`, () => {
      describe(`generate`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        let directoryExistedAtTimeOfCallingPerformGenerate: null | boolean = null
        let directoryWasClearedAtTimeOfCallingPerformGenerate: null | boolean = null

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            directoryExistedAtTimeOfCallingPerformGenerate = (await fs.promises.stat(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`))).isDirectory()

            directoryWasClearedAtTimeOfCallingPerformGenerate = true

            try {
              await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`))
              directoryWasClearedAtTimeOfCallingPerformGenerate = false
            } catch (e) {
              if (e.code !== `ENOENT`) {
                directoryWasClearedAtTimeOfCallingPerformGenerate = false
              }
            }

            try {
              await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`))
              directoryWasClearedAtTimeOfCallingPerformGenerate = false
            } catch (e) {
              if (e.code !== `ENOENT`) {
                directoryWasClearedAtTimeOfCallingPerformGenerate = false
              }
            }

            await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-h`), `test file h content`)
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-i`), `test file i content`)
            await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), `test file j content`)
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-cache-key-with-last-file-written-as-directory`,
            `test-last-file-written`,
          )

          await cacheItem.generate()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`calls performGenerate once`, () => expect(performGenerate).toHaveBeenCalledTimes(1))
        it(`has recreated the base path by the time of calling performGenerate`, () => expect(directoryExistedAtTimeOfCallingPerformGenerate).toBeTruthy())
        it(`has deleted existing files by the time of calling performGenerate`, () => expect(directoryWasClearedAtTimeOfCallingPerformGenerate).toBeTruthy())
        it(`does not modify created files after performGenerate`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-h`), `utf8`)).toEqual(`test file h content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-i`), `utf8`)).toEqual(`test file i content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), `utf8`)).toEqual(`test file j content`)
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `utf8`)).toEqual(`test file a content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `utf8`)).toEqual(`test file b content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
        })
      })

      describe(`cleanUp`, () => {
        const performGenerate = jasmine.createSpy(`performGenerate`)

        class MockPersistentCacheItem extends PersistentCacheItemBase {
          async performGenerate(): Promise<void> {
            return performGenerate()
          }
        }

        const pathSegments = [
          os.tmpdir(), `woobly-build-tool-helpers-persistent-cache-item-base`,
        ]
        let baseDirectory: string

        let cacheItem: MockPersistentCacheItem

        beforeAll(async () => {
          baseDirectory = await fs.promises.mkdtemp(path.join.apply(path, pathSegments))

          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-empty-cache-key`), { recursive: true })
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `test file a content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `test file b content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `test file c content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `test file d content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `test file e content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`), { recursive: true })
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-file-f`), `test file f content`)
          await fs.promises.writeFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-subdirectory`, `test-file-g`), `test file g content`)
          await fs.promises.mkdir(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`, `test-last-file-written`), { recursive: true })

          cacheItem = new MockPersistentCacheItem(
            [baseDirectory, `subdirectory-a`, `subdirectory-b`],
            `test-cache-key-with-last-file-written-as-directory`,
            `test-last-file-written`,
          )

          await cacheItem.dispose()
        })

        afterAll(async () => {
          await fs.promises.rmdir(baseDirectory, { recursive: true })
        })

        it(`does not call performGenerate`, () => expect(performGenerate).not.toHaveBeenCalledWith())
        it(`deletes the base path`, async () => {
          try {
            await fs.promises.access(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written-as-directory`))
            fail()
          } catch (e) {
            expect(e.code).toEqual(`ENOENT`)
          }
        })
        it(`does not modify other caches`, async () => {
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-file-a`), `utf8`)).toEqual(`test file a content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-without-last-file-written`, `test-subdirectory`, `test-file-b`), `utf8`)).toEqual(`test file b content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-file-c`), `utf8`)).toEqual(`test file c content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-subdirectory`, `test-file-d`), `utf8`)).toEqual(`test file d content`)
          expect(await fs.promises.readFile(path.join(baseDirectory, `subdirectory-a`, `subdirectory-b`, `test-cache-key-with-last-file-written`, `test-last-file-written`), `utf8`)).toEqual(`test file e content`)
        })
      })
    })
  })
})
