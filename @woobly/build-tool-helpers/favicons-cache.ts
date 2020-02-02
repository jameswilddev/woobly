import Cache from "./cache"
import Application from "./application"
import IDisposable from "./i-disposable"
import FaviconsCacheItem from "./favicons-cache-item"
import IFaviconsCache from "./i-favicons-cache"

export default class FaviconsCache extends Cache<Application> implements IFaviconsCache {
  constructor(
    public readonly basePath: ReadonlyArray<string>,
    public readonly production: boolean,
  ) {
    super()
  }

  createInstance(
    key: string,
  ): IDisposable<Application> {
    return new FaviconsCacheItem(this, key)
  }
}
