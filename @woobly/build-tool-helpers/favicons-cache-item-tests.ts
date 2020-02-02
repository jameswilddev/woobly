import * as os from "os"
import * as path from "path"
import * as fs from "fs"
import Application from "./application"
import FaviconsMetadata from "./favicons-metadata"
import IFaviconsCache from "./i-favicons-cache"
import FaviconsCacheItem from "./favicons-cache-item"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`FaviconsCacheItem`, () => {
    let baseDirectory: string
    let faviconsCache: IFaviconsCache
    let faviconsCacheItem: FaviconsCacheItem
    beforeAll(async () => {
      baseDirectory = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), `woobly-build-tool-helpers-favicons-cache-item`)
      )

      faviconsCache = {
        production: false,
        basePath: [baseDirectory, `test-sub`, `directory`]
      }

      faviconsCacheItem = new FaviconsCacheItem(faviconsCache, `test-key`)
    })

    afterAll(async () => {
      await fs.promises.rmdir(baseDirectory, { recursive: true })
    })

    describe(`faviconsCache`, () => {
      it(`is accessible`, () => expect(faviconsCacheItem.faviconsCache).toBe(faviconsCache))
    })
    describe(`key`, () => {
      it(`is accessible`, () => expect(faviconsCacheItem.key).toEqual(`test-key`))
    })
    describe(`basePath`, () => {
      it(`is that of the favicons cache`, () => expect(faviconsCacheItem.basePath).toEqual(faviconsCache.basePath))
    })
    describe(`key`, () => {
      it(`is that given`, () => expect(faviconsCacheItem.key).toEqual(`test-key`))
    })
    describe(`lastFileWritten`, () => {
      it(`is "metadata.json"`, () => expect(faviconsCacheItem.lastFileWritten).toEqual(`metadata.json`))
    })
    describe(`performGenerate`, () => {
      beforeAll(async () => {
        const metadata: Application = {
          logo: {
            filePath: [`test-data`, `favicons-cache-item`, `logo.png`],
            pixelArt: false,
            backgroundColor: `Test Logo Background Color`,
          },
          application: {
            name: {
              long: `Test Long Application Name`,
              short: `Test Short Application Name`,
            },
            description: `Test Application Description`,
            language: `Test Application Language`,
            version: `Test Application Version`,
            color: `Test Application Color`,
            appleStatusBarStyle: `black`,
            display: `minimalUi`,
            orientation: `portrait`,
          },
          developer: {
            name: `Test Developer Name`,
            website: `Test Developer Website`
          }
        }

        await faviconsCacheItem.performGenerate(metadata)
      })
      describe(`metadata.json`, () => {
        let metadata: FaviconsMetadata
        beforeAll(async () => {
          const metadataPath = path.join(baseDirectory, `test-sub`, `directory`, `test-key`, `metadata.json`)
          const text = await fs.promises.readFile(metadataPath, `utf8`)
          metadata = JSON.parse(text)
        })
        describe(`html`, () => {
          it(`contains the expected fragments`, () => expect(metadata.html).toEqual([
            `<link rel="shortcut icon" href="favicon.ico">`,
            `<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">`,
            `<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">`,
            `<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">`,
          ]))
        })
      })
      describe(`files`, () => {
        let expectedFiles: ReadonlyArray<string>
        let actualFiles: ReadonlyArray<string>
        beforeAll(async () => {
          expectedFiles = await fs.promises.readdir(path.join(`test-data`, `favicons-cache-item`, `files`))
          actualFiles = await fs.promises.readdir(path.join(baseDirectory, `test-sub`, `directory`, `test-key`, `files`))
        })
        it(`all are present`, () => expectedFiles.forEach(file => expect(actualFiles).toContain(file)))
        it(`none are unexpectedly present`, () => actualFiles.forEach(file => expect(expectedFiles).toContain(file)))
        it(`all contain the expected content`, async () => {
          const files = expectedFiles.filter(expected => actualFiles.includes(expected))
          for (const file of files) {
            const expectedPath = path.join(`test-data`, `favicons-cache-item`, `files`, file)
            const expectedFile = await fs.promises.readFile(expectedPath)
            const actualPath = path.join(baseDirectory, `test-sub`, `directory`, `test-key`, `files`, file)
            const actualFile = await fs.promises.readFile(actualPath)
            expect(actualFile).toEqual(expectedFile)
          }
        })
      })
    })
  })
})
