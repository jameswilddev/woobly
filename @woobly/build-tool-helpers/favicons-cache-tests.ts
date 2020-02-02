import FaviconsCacheItem from "./favicons-cache-item"
import { FaviconsCache } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`FaviconsCache`, () => {
    let faviconsCache: FaviconsCache
    beforeAll(() => {
      faviconsCache = new FaviconsCache([`Test`, `Base`, `Path`], true)
    })
    describe(`basePath`, () => {
      it(`is accessible`, () => expect(faviconsCache.basePath).toEqual([`Test`, `Base`, `Path`]))
    })
    describe(`production`, () => {
      it(`is accessible`, () => expect(faviconsCache.production).toBeTrue())
    })
    describe(`createInstance`, () => {
      let result: FaviconsCacheItem
      beforeAll(() => {
        result = faviconsCache.createInstance(`Test Key`) as FaviconsCacheItem
      })
      it(`returns a favicon cache item`, () => expect(result).toEqual(jasmine.any(FaviconsCacheItem)))
      it(`uses a reference to the cache itself`, () => expect(result.faviconsCache).toBe(faviconsCache))
      it(`uses the key`, () => expect(result.key).toEqual(`Test Key`))
    })
  })
})
