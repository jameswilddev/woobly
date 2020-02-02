import * as fs from "fs"
import * as path from "path"
import * as favicons from "favicons"
import generateFaviconsConfiguration from "./generate-favicons-configuration"
import Application from "./application"
import PersistentCacheItemBase from "./persistent-cache-item-base"
import IFaviconsCache from "./i-favicons-cache"
import writeFile from "./write-file"
import FaviconsMetadata from "./favicons-metadata"

export default class FaviconsCacheItem extends PersistentCacheItemBase<Application> {
  constructor(
    public readonly faviconsCache: IFaviconsCache,
    public readonly key: string,
  ) {
    super(faviconsCache.basePath, key, `metadata.json`)
  }

  async performGenerate(
    metadata: Application,
  ): Promise<void> {
    const configuration = generateFaviconsConfiguration(
      metadata,
      this.faviconsCache.production,
    )

    const generated = await favicons(
      path.join.apply(path, metadata.logo.filePath.slice()),
      configuration,
    )

    await fs.promises.mkdir(path.join(this.pathToKeyDirectory, `files`), { recursive: true })

    const allFiles = generated.files.concat(generated.images)

    for (const file of allFiles) {
      await writeFile(
        [this.pathToKeyDirectory, `files`, file.name],
        file.contents,
        this.faviconsCache.production
      )
    }

    const json: FaviconsMetadata = {
      html: generated.html,
    }

    const text = JSON.stringify(json)

    await fs.promises.writeFile(this.pathToLastFileWritten, text)
  }
}
