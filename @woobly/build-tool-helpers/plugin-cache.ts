import Cache from "./cache"
import ContentFilePath from "./content-file-path"
import IDisposable from "./i-disposable"
import PluginCacheItem from "./plugin-cache-item"
import IPluginCache from "./i-plugin-cache"

export default class PluginCache extends Cache<ContentFilePath> implements IPluginCache {
  constructor(
    public readonly basePath: ReadonlyArray<string>,
    public readonly production: boolean,
  ) {
    super()
  }

  createInstance(
    key: string,
  ): IDisposable<ContentFilePath> {
    return new PluginCacheItem(this, key)
  }
}
