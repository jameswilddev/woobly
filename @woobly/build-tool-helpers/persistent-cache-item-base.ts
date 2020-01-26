import * as fs from "fs"
import * as path from "path"
import DisposableBase from "./disposable-base"

export default abstract class PersistentCacheItemBase extends DisposableBase {
  public readonly pathToKeyDirectory: string
  public readonly pathToLastFileWritten: string

  constructor(
    public readonly basePath: ReadonlyArray<string>,
    public readonly key: string,
    public readonly lastFileWritten: string,
  ) {
    super()
    this.pathToKeyDirectory = path.join.apply(path, basePath.concat([key]))
    this.pathToLastFileWritten = path.join(this.pathToKeyDirectory, lastFileWritten)
  }

  async generate(): Promise<void> {
    try {
      const stat = await fs.promises.stat(this.pathToLastFileWritten)
      if (stat.isFile()) {
        return
      }
    } catch { }

    await this.cleanUp()
    await fs.promises.mkdir(this.pathToKeyDirectory, { recursive: true });

    await this.performGenerate()
  }

  abstract performGenerate(): Promise<void>

  async cleanUp(): Promise<void> {
    await fs.promises.rmdir(this.pathToKeyDirectory, { recursive: true });
  }
}
