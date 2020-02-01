import { IDisposable, Cache } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`Cache`, () => {
    type MockMetadata =
      | `Test Metadata A`
      | `Test Metadata B`
      | `Test Metadata C`
      | `Test Metadata D`
      | `Test Metadata E`
      | `Test Metadata F`
      | `Test Metadata G`
      | `Test Metadata H`
      | `Test Metadata I`
      | `Test Metadata J`
      | `Test Metadata K`
      | `Test Metadata L`
      | `Test Metadata M`
      | `Test Metadata N`
      | `Test Metadata O`
      | `Test Metadata P`
      | `Test Metadata Q`
      | `Test Metadata R`
      | `Test Metadata S`
      | `Test Metadata T`

    class MockCacheItem implements IDisposable<MockMetadata> {
      latestCall: null | `initialize` | `dispose` = null
      metadata: MockMetadata[] = []

      async initialize(
        metadata: MockMetadata,
      ): Promise<void> {
        this.latestCall = `initialize`
        this.metadata.push(metadata)
      }

      async dispose(): Promise<void> {
        this.latestCall = `dispose`
      }
    }

    describe(`when no purge is performed`, () => {
      const existingUnused = new MockCacheItem()
      const existingDependedUponThenReleased = new MockCacheItem()
      const existingDependedUponThenPartiallyReleased = new MockCacheItem()
      const existingDependedUpon = new MockCacheItem()
      const existingDependedUponThenDependedUpon = new MockCacheItem()
      const existingDependedUponThenReleasedThenDependedUpon = new MockCacheItem()
      const newDependedUponThenReleased = new MockCacheItem()
      const newDependedUponThenPartiallyReleased = new MockCacheItem()
      const newDependedUpon = new MockCacheItem()
      const newDependedUponThenDependedUpon = new MockCacheItem()
      const newDependedUponThenReleasedThenDependedUpon = new MockCacheItem()

      const createInstance = jasmine.createSpy(`createInstance`).and.callFake(key => {
        switch (key) {
          case `Test Existing Unused`:
            return existingUnused
          case `Test Existing Depended Upon Then Released`:
            return existingDependedUponThenReleased
          case `Test Existing Depended Upon Then Partially Released`:
            return existingDependedUponThenPartiallyReleased
          case `Test Existing Depended Upon`:
            return existingDependedUpon
          case `Test Existing Depended Upon Then Depended Upon`:
            return existingDependedUponThenDependedUpon
          case `Test Existing Depended Upon Then Released Then Depended Upon`:
            return existingDependedUponThenReleasedThenDependedUpon
          case `Test New Depended Upon Then Released`:
            return newDependedUponThenReleased
          case `Test New Depended Upon Then Partially Released`:
            return newDependedUponThenPartiallyReleased
          case `Test New Depended Upon`:
            return newDependedUpon
          case `Test New Depended Upon Then Depended Upon`:
            return newDependedUponThenDependedUpon
          case `Test New Depended Upon Then Released Then Depended Upon`:
            return newDependedUponThenReleasedThenDependedUpon
          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

      class MockCache extends Cache<MockMetadata> {
        createInstance(key: string): IDisposable<MockMetadata> {
          return createInstance(key)
        }
      }

      const cache = new MockCache()

      cache.initialize([
        `Test Existing Unused`,
        `Test Existing Depended Upon Then Released`,
        `Test Existing Depended Upon Then Partially Released`,
        `Test Existing Depended Upon`,
        `Test Existing Depended Upon Then Depended Upon`,
        `Test Existing Depended Upon Then Released Then Depended Upon`,
      ])

      beforeAll(async () => {
        await Promise.all([
          cache.depend(`Test Existing Depended Upon Then Released`, `Test Metadata A`),
          cache.release(`Test Existing Depended Upon Then Released`),
          cache.depend(`Test Existing Depended Upon Then Partially Released`, `Test Metadata B`),
          cache.depend(`Test Existing Depended Upon Then Partially Released`, `Test Metadata C`),
          cache.release(`Test Existing Depended Upon Then Partially Released`),
          cache.depend(`Test Existing Depended Upon`, `Test Metadata D`),
          cache.depend(`Test Existing Depended Upon Then Depended Upon`, `Test Metadata E`),
          cache.depend(`Test Existing Depended Upon Then Depended Upon`, `Test Metadata F`),
          cache.depend(`Test Existing Depended Upon Then Released Then Depended Upon`, `Test Metadata G`),
          cache.release(`Test Existing Depended Upon Then Released Then Depended Upon`),
          cache.depend(`Test Existing Depended Upon Then Released Then Depended Upon`, `Test Metadata H`),
          cache.depend(`Test New Depended Upon Then Released`, `Test Metadata I`),
          cache.release(`Test New Depended Upon Then Released`),
          cache.depend(`Test New Depended Upon Then Partially Released`, `Test Metadata J`),
          cache.depend(`Test New Depended Upon Then Partially Released`, `Test Metadata K`),
          cache.release(`Test New Depended Upon Then Partially Released`),
          cache.depend(`Test New Depended Upon`, `Test Metadata L`),
          cache.depend(`Test New Depended Upon Then Depended Upon`, `Test Metadata M`),
          cache.depend(`Test New Depended Upon Then Depended Upon`, `Test Metadata N`),
          cache.depend(`Test New Depended Upon Then Released Then Depended Upon`, `Test Metadata O`),
          cache.release(`Test New Depended Upon Then Released Then Depended Upon`),
          cache.depend(`Test New Depended Upon Then Released Then Depended Upon`, `Test Metadata P`),
        ])
      })

      it(`does not initialize or dispose of existing items which are released`, () => expect(existingUnused.latestCall).toBeNull())
      it(`creates instances of existing items which are released`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Unused`))

      it(`disposes of existing items which are depended upon then released`, () => expect(existingDependedUponThenReleased.latestCall).toEqual(`dispose`))
      it(`uses only expected metadata when initializing existing items which are depended upon then released`, () => existingDependedUponThenReleased.metadata.forEach(metadata => expect([`Test Metadata A`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then released`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Released`))

      it(`initializes existing items which are depended upon then partially released`, () => expect(existingDependedUponThenPartiallyReleased.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon then partially released`, () => existingDependedUponThenPartiallyReleased.metadata.forEach(metadata => expect([`Test Metadata B`, `Test Metadata C`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then partially released`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Partially Released`))

      it(`initializes existing items which are depended upon`, () => expect(existingDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon`, () => existingDependedUpon.metadata.forEach(metadata => expect([`Test Metadata D`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon`))

      it(`initializes existing items which are depended upon then depended upon`, () => expect(existingDependedUponThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon then depended upon`, () => existingDependedUponThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata E`, `Test Metadata F`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Depended Upon`))

      it(`initializes existing items which are depended upon then released then depended upon`, () => expect(existingDependedUponThenReleasedThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon then released then depended upon`, () => existingDependedUponThenReleasedThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata G`, `Test Metadata H`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then released then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Released Then Depended Upon`))

      it(`disposes of new items which are depended upon then released`, () => expect(newDependedUponThenReleased.latestCall).toEqual(`dispose`))
      it(`uses only expected metadata when initializing new items which are depended upon then released`, () => newDependedUponThenReleased.metadata.forEach(metadata => expect([`Test Metadata I`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then released`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Released`))

      it(`initializes new items which are depended upon then partially released`, () => expect(newDependedUponThenPartiallyReleased.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon then partially released`, () => newDependedUponThenPartiallyReleased.metadata.forEach(metadata => expect([`Test Metadata J`, `Test Metadata K`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then partially released`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Partially Released`))

      it(`initializes new items which are depended upon`, () => expect(newDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon`, () => newDependedUpon.metadata.forEach(metadata => expect([`Test Metadata L`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon`))

      it(`initializes new items which are depended upon then depended upon`, () => expect(newDependedUponThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon then depended upon`, () => newDependedUponThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata M`, `Test Metadata N`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Depended Upon`))

      it(`initializes new items which are depended upon then released then depended upon`, () => expect(newDependedUponThenReleasedThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon then released then depended upon`, () => newDependedUponThenReleasedThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata O`, `Test Metadata P`, `Test Metadata Q`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then released then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Released Then Depended Upon`))

      it(`does not create any further items`, () => expect(createInstance).toHaveBeenCalledTimes(11))
    })

    describe(`when a purge is performed`, () => {
      const existingUnused = new MockCacheItem()
      const existingDependedUponThenReleased = new MockCacheItem()
      const existingDependedUponThenPartiallyReleased = new MockCacheItem()
      const existingDependedUpon = new MockCacheItem()
      const existingDependedUponThenDependedUpon = new MockCacheItem()
      const existingDependedUponThenReleasedThenDependedUpon = new MockCacheItem()
      const existingAfterPurgeDependedUpon = new MockCacheItem()
      const existingAfterPurgeReleased = new MockCacheItem()
      const newDependedUponThenReleased = new MockCacheItem()
      const newDependedUponThenPartiallyReleased = new MockCacheItem()
      const newDependedUpon = new MockCacheItem()
      const newDependedUponThenDependedUpon = new MockCacheItem()
      const newDependedUponThenReleasedThenDependedUpon = new MockCacheItem()
      const newAfterPurgeDependedUpon = new MockCacheItem()
      const newAfterPurgeReleased = new MockCacheItem()

      const createInstance = jasmine.createSpy(`createInstance`).and.callFake(key => {
        switch (key) {
          case `Test Existing Unused`:
            return existingUnused
          case `Test Existing Depended Upon Then Released`:
            return existingDependedUponThenReleased
          case `Test Existing Depended Upon Then Partially Released`:
            return existingDependedUponThenPartiallyReleased
          case `Test Existing Depended Upon`:
            return existingDependedUpon
          case `Test Existing Depended Upon Then Depended Upon`:
            return existingDependedUponThenDependedUpon
          case `Test Existing Depended Upon Then Released Then Depended Upon`:
            return existingDependedUponThenReleasedThenDependedUpon
          case `Test Existing After Purge Depended Upon`:
            return existingAfterPurgeDependedUpon
          case `Test Existing After Purge Released`:
            return existingAfterPurgeReleased
          case `Test New Depended Upon Then Released`:
            return newDependedUponThenReleased
          case `Test New Depended Upon Then Partially Released`:
            return newDependedUponThenPartiallyReleased
          case `Test New Depended Upon`:
            return newDependedUpon
          case `Test New Depended Upon Then Depended Upon`:
            return newDependedUponThenDependedUpon
          case `Test New Depended Upon Then Released Then Depended Upon`:
            return newDependedUponThenReleasedThenDependedUpon
          case `Test New After Purge Depended Upon`:
            return newAfterPurgeDependedUpon
          case `Test New After Purge Released`:
            return newAfterPurgeReleased
          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

      class MockCache extends Cache<MockMetadata> {
        createInstance(key: string): IDisposable<MockMetadata> {
          return createInstance(key)
        }
      }

      const cache = new MockCache()

      cache.initialize([
        `Test Existing Unused`,
        `Test Existing Depended Upon Then Released`,
        `Test Existing Depended Upon Then Partially Released`,
        `Test Existing Depended Upon`,
        `Test Existing Depended Upon Then Depended Upon`,
        `Test Existing Depended Upon Then Released Then Depended Upon`,
        `Test Existing After Purge Depended Upon`,
        `Test Existing After Purge Released`,
      ])

      beforeAll(async () => {
        await Promise.all([
          cache.depend(`Test Existing Depended Upon Then Released`, `Test Metadata A`),
          cache.release(`Test Existing Depended Upon Then Released`),
          cache.depend(`Test Existing Depended Upon Then Partially Released`, `Test Metadata B`),
          cache.depend(`Test Existing Depended Upon Then Partially Released`, `Test Metadata C`),
          cache.release(`Test Existing Depended Upon Then Partially Released`),
          cache.depend(`Test Existing Depended Upon`, `Test Metadata D`),
          cache.depend(`Test Existing Depended Upon Then Depended Upon`, `Test Metadata E`),
          cache.depend(`Test Existing Depended Upon Then Depended Upon`, `Test Metadata F`),
          cache.depend(`Test Existing Depended Upon Then Released Then Depended Upon`, `Test Metadata G`),
          cache.release(`Test Existing Depended Upon Then Released Then Depended Upon`),
          cache.depend(`Test Existing Depended Upon Then Released Then Depended Upon`, `Test Metadata H`),
          cache.depend(`Test Existing After Purge Released`, `Test Metadata I`),
          cache.depend(`Test New Depended Upon Then Released`, `Test Metadata J`),
          cache.release(`Test New Depended Upon Then Released`),
          cache.depend(`Test New Depended Upon Then Partially Released`, `Test Metadata K`),
          cache.depend(`Test New Depended Upon Then Partially Released`, `Test Metadata L`),
          cache.release(`Test New Depended Upon Then Partially Released`),
          cache.depend(`Test New Depended Upon`, `Test Metadata M`),
          cache.depend(`Test New Depended Upon Then Depended Upon`, `Test Metadata N`),
          cache.depend(`Test New Depended Upon Then Depended Upon`, `Test Metadata O`),
          cache.depend(`Test New Depended Upon Then Released Then Depended Upon`, `Test Metadata P`),
          cache.release(`Test New Depended Upon Then Released Then Depended Upon`),
          cache.depend(`Test New Depended Upon Then Released Then Depended Upon`, `Test Metadata Q`),
          cache.depend(`Test New After Purge Released`, `Test Metadata R`),
          cache.purge(),
          cache.depend(`Test Existing After Purge Depended Upon`, `Test Metadata S`),
          cache.release(`Test Existing After Purge Released`),
          cache.depend(`Test New After Purge Depended Upon`, `Test Metadata T`),
          cache.release(`Test New After Purge Released`),
        ])
      })

      it(`disposes of existing items which are released`, () => expect(existingUnused.latestCall).toEqual(`dispose`))
      it(`creates instances of existing items which are released`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Unused`))

      it(`disposes of existing items which are depended upon then released`, () => expect(existingDependedUponThenReleased.latestCall).toEqual(`dispose`))
      it(`uses only expected metadata when initializing existing items which are depended upon then released`, () => existingDependedUponThenReleased.metadata.forEach(metadata => expect([`Test Metadata A`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then released`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Released`))

      it(`initializes existing items which are depended upon then partially released`, () => expect(existingDependedUponThenPartiallyReleased.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon then partially released`, () => existingDependedUponThenPartiallyReleased.metadata.forEach(metadata => expect([`Test Metadata B`, `Test Metadata C`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then partially released`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Partially Released`))

      it(`initializes existing items which are depended upon`, () => expect(existingDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon`, () => existingDependedUpon.metadata.forEach(metadata => expect([`Test Metadata D`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon`))

      it(`initializes existing items which are depended upon then depended upon`, () => expect(existingDependedUponThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon then depended upon`, () => existingDependedUponThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata E`, `Test Metadata F`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Depended Upon`))

      it(`initializes existing items which are depended upon then released then depended upon`, () => expect(existingDependedUponThenReleasedThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon then released then depended upon`, () => existingDependedUponThenReleasedThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata G`, `Test Metadata H`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon then released then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing Depended Upon Then Released Then Depended Upon`))

      it(`disposes of existing items which are released after purge`, () => expect(existingAfterPurgeReleased.latestCall).toEqual(`dispose`))
      it(`uses only expected metadata when initializing existing items which are released after purge`, () => existingAfterPurgeReleased.metadata.forEach(metadata => expect([`Test Metadata I`]).toContain(metadata)))
      it(`creates instances of existing items which are released after purge`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing After Purge Released`))

      it(`disposes of new items which are depended upon then released`, () => expect(newDependedUponThenReleased.latestCall).toEqual(`dispose`))
      it(`uses only expected metadata when initializing new items which are depended upon then released`, () => newDependedUponThenReleased.metadata.forEach(metadata => expect([`Test Metadata J`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then released`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Released`))

      it(`initializes new items which are depended upon then partially released`, () => expect(newDependedUponThenPartiallyReleased.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon then partially released`, () => newDependedUponThenPartiallyReleased.metadata.forEach(metadata => expect([`Test Metadata K`, `Test Metadata L`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then partially released`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Partially Released`))

      it(`initializes new items which are depended upon`, () => expect(newDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon`, () => newDependedUpon.metadata.forEach(metadata => expect([`Test Metadata M`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon`))

      it(`initializes new items which are depended upon then depended upon`, () => expect(newDependedUponThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon then depended upon`, () => newDependedUponThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata N`, `Test Metadata O`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Depended Upon`))

      it(`initializes new items which are depended upon then released then depended upon`, () => expect(newDependedUponThenReleasedThenDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon then released then depended upon`, () => newDependedUponThenReleasedThenDependedUpon.metadata.forEach(metadata => expect([`Test Metadata P`, `Test Metadata Q`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon then released then depended upon`, () => expect(createInstance).toHaveBeenCalledWith(`Test New Depended Upon Then Released Then Depended Upon`))

      it(`disposes of new items which are released after purge`, () => expect(newAfterPurgeReleased.latestCall).toEqual(`dispose`))
      it(`uses only expected metadata when initializing new items which are released after purge`, () => newAfterPurgeReleased.metadata.forEach(metadata => expect([`Test Metadata R`]).toContain(metadata)))
      it(`creates instances of new items which are released after purge`, () => expect(createInstance).toHaveBeenCalledWith(`Test New After Purge Released`))

      it(`initializes existing items which are depended upon after purge`, () => expect(existingAfterPurgeDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing existing items which are depended upon after purge`, () => existingAfterPurgeDependedUpon.metadata.forEach(metadata => expect([`Test Metadata S`]).toContain(metadata)))
      it(`creates instances of existing items which are depended upon after purge`, () => expect(createInstance).toHaveBeenCalledWith(`Test Existing After Purge Depended Upon`))

      it(`initializes new items which are depended upon after purge`, () => expect(newAfterPurgeDependedUpon.latestCall).toEqual(`initialize`))
      it(`uses only expected metadata when initializing new items which are depended upon after purge`, () => newAfterPurgeDependedUpon.metadata.forEach(metadata => expect([`Test Metadata T`]).toContain(metadata)))
      it(`creates instances of new items which are depended upon after purge`, () => expect(createInstance).toHaveBeenCalledWith(`Test New After Purge Depended Upon`))

      it(`does not create any further items`, () => expect(createInstance).toHaveBeenCalledTimes(15))
    })

    describe(`when an existing item is released which was never depended upon`, () => {
      const existingUnused = new MockCacheItem()
      const existingOther = new MockCacheItem()

      const createInstance = jasmine.createSpy(`createInstance`).and.callFake(key => {
        switch (key) {
          case `Test Existing Unused`:
            return existingUnused
          case `Test Existing Other`:
            return existingOther
          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

      class MockCache extends Cache<MockMetadata> {
        createInstance(key: string): IDisposable<MockMetadata> {
          return createInstance(key)
        }
      }

      const cache = new MockCache()

      cache.initialize([
        `Test Existing Unused`,
        `Test Existing Other`,
      ])

      let error: Error

      beforeAll(async () => {
        try {
          await cache.release(`Test Existing Unused`)
        } catch (e) {
          error = e
        }
      })

      it(`throws the expected error`, () => expect(error).toEqual(new Error(`Attempt to release unused cache key "Test Existing Unused".`)))
      it(`does not create any items`, () => expect(createInstance).toHaveBeenCalledTimes(2))

      it(`does not initialize or dispose of the item`, () => expect(existingUnused.latestCall).toBeNull())
      it(`does not initialize or dispose of other items`, () => expect(existingOther.latestCall).toBeNull())
    })

    describe(`when an existing item is released which was previously released`, () => {
      const existingReleased = new MockCacheItem()
      const existingUnused = new MockCacheItem()
      const existingOther = new MockCacheItem()

      const createInstance = jasmine.createSpy(`createInstance`).and.callFake(key => {
        switch (key) {
          case `Test Existing Released`:
            return existingReleased
          case `Test Existing Unused`:
            return existingUnused
          case `Test Existing Other`:
            return existingOther
          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

      class MockCache extends Cache<MockMetadata> {
        createInstance(key: string): IDisposable<MockMetadata> {
          return createInstance(key)
        }
      }

      const cache = new MockCache()

      cache.initialize([
        `Test Existing Released`,
        `Test Existing Unused`,
        `Test Existing Other`,
      ])

      let error: Error

      beforeAll(async () => {
        await Promise.all([
          cache.depend(`Test Existing Released`, `Test Metadata A`),
          cache.release(`Test Existing Released`),
        ])

        try {
          await cache.release(`Test Existing Released`)
        } catch (e) {
          error = e
        }
      })

      it(`throws the expected error`, () => expect(error).toEqual(new Error(`Attempt to release unused cache key "Test Existing Released".`)))
      it(`does not create any items`, () => expect(createInstance).toHaveBeenCalledTimes(3))

      it(`leaves the item disposed`, () => expect(existingReleased.latestCall).toEqual(`dispose`))
      it(`does not initialize or dispose of other items`, () => expect(existingUnused.latestCall).toBeNull())
      it(`does not initialize or dispose of other items`, () => expect(existingOther.latestCall).toBeNull())
    })

    describe(`when a new item is released which was never depended upon`, () => {
      const existingOther = new MockCacheItem()

      const createInstance = jasmine.createSpy(`createInstance`).and.callFake(key => {
        switch (key) {
          case `Test Existing Other`:
            return existingOther
          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

      class MockCache extends Cache<MockMetadata> {
        createInstance(key: string): IDisposable<MockMetadata> {
          return createInstance(key)
        }
      }

      const cache = new MockCache()

      cache.initialize([
        `Test Existing Other`,
      ])

      let error: Error

      beforeAll(async () => {
        try {
          await cache.release(`Test New`)
        } catch (e) {
          error = e
        }
      })

      it(`throws the expected error`, () => expect(error).toEqual(new Error(`Attempt to release unused cache key "Test New".`)))
      it(`does not create any items`, () => expect(createInstance).toHaveBeenCalledTimes(1))

      it(`does not initialize or dispose of other items`, () => expect(existingOther.latestCall).toBeNull())
    })

    describe(`when a new item is released which was previously released`, () => {
      const existingOther = new MockCacheItem()
      const newReleased = new MockCacheItem()

      const createInstance = jasmine.createSpy(`createInstance`).and.callFake(key => {
        switch (key) {
          case `Test Existing Other`:
            return existingOther
          case `Test New Released`:
            return newReleased
          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

      class MockCache extends Cache<MockMetadata> {
        createInstance(key: string): IDisposable<MockMetadata> {
          return createInstance(key)
        }
      }

      const cache = new MockCache()

      cache.initialize([
        `Test Existing Other`,
      ])

      let error: Error

      beforeAll(async () => {
        await Promise.all([
          cache.depend(`Test New Released`, `Test Metadata A`),
          cache.release(`Test New Released`),
        ])

        try {
          await cache.release(`Test New Released`)
        } catch (e) {
          error = e
        }
      })

      it(`throws the expected error`, () => expect(error).toEqual(new Error(`Attempt to release unused cache key "Test New Released".`)))
      it(`does not create any items`, () => expect(createInstance).toHaveBeenCalledTimes(2))

      it(`leaves the item disposed`, () => expect(newReleased.latestCall).toEqual(`dispose`))
      it(`does not initialize or dispose of other items`, () => expect(existingOther.latestCall).toBeNull())
    })
  })
})
