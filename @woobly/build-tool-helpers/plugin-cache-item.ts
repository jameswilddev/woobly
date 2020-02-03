import * as fs from "fs"
import * as path from "path"
import ContentFilePath from "./content-file-path"
import PersistentCacheItemBase from "./persistent-cache-item-base"
import IPluginCache from "./i-plugin-cache"

export default class PluginCacheItem extends PersistentCacheItemBase<ContentFilePath> {
  constructor(
    public readonly pluginCache: IPluginCache,
    public readonly key: string,
  ) {
    super(pluginCache.basePath, key, `generated.ts`)
  }

  async performGenerate(
    metadata: ContentFilePath,
  ): Promise<void> {
    const cacheDirectory = path.join(this.pathToKeyDirectory, `cache`)
    await fs.promises.mkdir(cacheDirectory, { recursive: true })
    const result = await metadata.plugin.instance(metadata.filePath, cacheDirectory)
    await fs.promises.writeFile(this.pathToLastFileWritten, result.generatedTypeScript)
  }
}
