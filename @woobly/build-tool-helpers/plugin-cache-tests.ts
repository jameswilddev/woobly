import PluginCacheItem from "./plugin-cache-item"
import { PluginCache } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`PluginCache`, () => {
    let pluginCache: PluginCache
    beforeAll(() => {
      pluginCache = new PluginCache([`Test`, `Base`, `Path`], true)
    })
    describe(`basePath`, () => {
      it(`is accessible`, () => expect(pluginCache.basePath).toEqual([`Test`, `Base`, `Path`]))
    })
    describe(`production`, () => {
      it(`is accessible`, () => expect(pluginCache.production).toBeTrue())
    })
    describe(`createInstance`, () => {
      let result: PluginCacheItem
      beforeAll(() => {
        result = pluginCache.createInstance(`Test Key`) as PluginCacheItem
      })
      it(`returns a plugin cache item`, () => expect(result).toEqual(jasmine.any(PluginCacheItem)))
      it(`uses a reference to the cache itself`, () => expect(result.pluginCache).toBe(pluginCache))
      it(`uses the key`, () => expect(result.key).toEqual(`Test Key`))
    })
  })
})
