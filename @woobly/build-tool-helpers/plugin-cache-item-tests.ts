import * as os from "os"
import * as path from "path"
import * as fs from "fs"
import IPluginCache from "./i-plugin-cache"
import PluginCacheItem from "./plugin-cache-item"
import ContentFilePath from "./content-file-path"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`PluginCacheItem`, () => {
    let baseDirectory: string
    let pluginCache: IPluginCache
    let pluginCacheItem: PluginCacheItem
    beforeAll(async () => {
      baseDirectory = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), `woobly-build-tool-helpers-plugin-cache-item`)
      )

      pluginCache = {
        production: false,
        basePath: [baseDirectory, `test-sub`, `directory`]
      }

      pluginCacheItem = new PluginCacheItem(pluginCache, `test-key`)
    })

    afterAll(async () => {
      await fs.promises.rmdir(baseDirectory, { recursive: true })
    })

    describe(`faviconsCache`, () => {
      it(`is accessible`, () => expect(pluginCacheItem.pluginCache).toBe(pluginCache))
    })
    describe(`key`, () => {
      it(`is accessible`, () => expect(pluginCacheItem.key).toEqual(`test-key`))
    })
    describe(`basePath`, () => {
      it(`is that of the favicons cache`, () => expect(pluginCacheItem.basePath).toEqual(pluginCache.basePath))
    })
    describe(`key`, () => {
      it(`is that given`, () => expect(pluginCacheItem.key).toEqual(`test-key`))
    })
    describe(`lastFileWritten`, () => {
      it(`is "generated.ts"`, () => expect(pluginCacheItem.lastFileWritten).toEqual(`generated.ts`))
    })
    describe(`performGenerate`, () => {
      let directoryExistedAtTimeOfCallingPerformGenerate = false
      let pluginInstance: jasmine.Spy
      beforeAll(async () => {
        pluginInstance = jasmine
          .createSpy(`pluginInstance`)
          .and
          .callFake(async () => {
            directoryExistedAtTimeOfCallingPerformGenerate = (await fs.promises.stat(path.join(baseDirectory, `test-sub`, `directory`, `test-key`, `cache`))).isDirectory()
            return {
              generatedTypeScript: `Test Generated TypeScript`
            }
          })

        const metadata: ContentFilePath = {
          filePath: `Test File Path`,
          plugin: {
            name: `Test Plugin Name`,
            cacheKeyPrefix: `Test Cache Key Prefix`,
            fileExtension: `Test File Extension`,
            instance: pluginInstance
          },
          typeScriptIdentifier: `Test TypeScript Identifier`,
        }

        await pluginCacheItem.performGenerate(metadata)
      })
      describe(`plugin instance`, () => {
        it(`is executed once`, () => expect(pluginInstance).toHaveBeenCalledTimes(1))
        it(`is given the source file path`, () => expect(pluginInstance).toHaveBeenCalledWith(`Test File Path`, jasmine.any(String)))
        it(`is given the path to a suitable cache directory`, () => expect(pluginInstance).toHaveBeenCalledWith(jasmine.any(String), path.join(baseDirectory, `test-sub`, `directory`, `test-key`, `cache`)))
        it(`had created the cache directory at the time of executing`, () => expect(directoryExistedAtTimeOfCallingPerformGenerate).toBeTrue())
      })
      describe(`generated.ts`, () => {
        let text: string
        beforeAll(async () => {
          const metadataPath = path.join(baseDirectory, `test-sub`, `directory`, `test-key`, `generated.ts`)
          text = await fs.promises.readFile(metadataPath, `utf8`)
        })
        it(`contains the expected TypeScript`, () => expect(text).toEqual(`Test Generated TypeScript`))
      })
    })
  })
})
