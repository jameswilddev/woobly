import IDisposable from "./i-disposable"
import mapObjectArray from "./map-object-array"

export default abstract class Cache<TMetadata> {
  private readonly items: {
    [key: string]: {
      users: number
      needsPurging: boolean
      readonly instance: IDisposable<TMetadata>
    }
  } = {}

  constructor(
    existingKeys: ReadonlyArray<string>,
  ) {
    existingKeys.forEach(key => this.items[key] = {
      users: 0,
      needsPurging: true,
      instance: this.createInstance(key),
    })
  }

  abstract createInstance(key: string): IDisposable<TMetadata>

  async depend(
    key: string,
    metadata: TMetadata,
  ): Promise<void> {
    if (!Object.prototype.hasOwnProperty.call(this.items, key)) {
      this.items[key] = {
        users: 0,
        needsPurging: false,
        instance: this.createInstance(key),
      }
    }

    const item = this.items[key]
    item.users++

    if (this.items[key].users === 1) {
      item.needsPurging = false
      await this.items[key].instance.initialize(metadata)
    }
  }

  async release(
    key: string,
  ): Promise<void> {
    if (!Object.prototype.hasOwnProperty.call(this.items, key) || this.items[key].users === 0) {
      throw new Error(`Attempt to release unused cache key "${key}".`)
    }

    const item = this.items[key]

    item.users--

    if (!item.users) {
      await item.instance.dispose()
    }
  }

  async purge(): Promise<void> {
    await mapObjectArray(
      `Purging unused cache items...`,
      { ...this.items },
      async (key, value) => {
        key
        if (value.needsPurging) {
          value.needsPurging = false
          value.instance.dispose()
        }
      },
    )
  }
}
