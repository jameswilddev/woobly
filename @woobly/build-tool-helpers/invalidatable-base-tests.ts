import { InvalidatableBase } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`invalidatableBase`, () => {
    type MockMetadata = `Test Metadata`

    let generateResolve: () => void
    let generateReject: (reason: any) => void
    let generate: jasmine.Spy
    let cleanUpResolve: () => void
    let cleanUpReject: (reason: any) => void
    let cleanUp: jasmine.Spy
    let invalidatable: InvalidatableBase<MockMetadata>
    let returnedPromise: Promise<void>
    let resolvedPromise: boolean

    class InvalidatableMock extends InvalidatableBase<MockMetadata> {
      generate(
        metadata: MockMetadata,
      ) {
        generate(metadata)
        return new Promise<void>((resolve, reject) => {
          generateResolve = resolve
          generateReject = reject
        })
      }

      cleanUp() {
        cleanUp()
        return new Promise<void>((resolve, reject) => {
          cleanUpResolve = resolve
          cleanUpReject = reject
        })
      }
    }

    beforeEach(() => {
      generate = jasmine.createSpy(`generate`)
      cleanUp = jasmine.createSpy(`cleanUp`)

      invalidatable = new InvalidatableMock()
      resolvedPromise = false
    })

    const delay = 50

    describe(`when nothing is done`, () => {
      it(`does not call generate`, () => expect(generate).not.toHaveBeenCalled())
      it(`does not call cleanUp`, () => expect(cleanUp).not.toHaveBeenCalled())
    })

    describe(`when invalidate is called`, () => {
      beforeEach(done => {
        returnedPromise = invalidatable.invalidate(`Test Metadata`)
        returnedPromise.then(
          () => { resolvedPromise = true },
          () => { resolvedPromise = true },
        )
        setTimeout(done, delay)
      })
      it(`does not call generate`, () => expect(generate).not.toHaveBeenCalled())
      it(`calls cleanUp once`, () => expect(cleanUp).toHaveBeenCalledTimes(1))
      it(`does not resolve or reject the returned promise`, () => expect(resolvedPromise).toBeFalse())
      describe(`when cleanUp resolves`, () => {
        beforeEach(done => {
          cleanUpResolve()
          setTimeout(done, delay)
        })
        it(`calls generate once`, () => expect(generate).toHaveBeenCalledTimes(1))
        it(`calls generate with the given metadata`, () => expect(generate).toHaveBeenCalledWith(`Test Metadata`))
        it(`does not call cleanUp again`, () => expect(cleanUp).toHaveBeenCalledTimes(1))
        it(`does not resolve or reject the returned promise`, () => expect(resolvedPromise).toBeFalse())
        describe(`when generate resolves`, () => {
          beforeEach(done => {
            generateResolve()
            setTimeout(done, delay)
          })
          it(`does not call generate again`, () => expect(generate).toHaveBeenCalledTimes(1))
          it(`does not call cleanUp again`, () => expect(cleanUp).toHaveBeenCalledTimes(1))
          it(`resolves the returned promise`, () => expectAsync(returnedPromise).toBeResolved())
        })
        describe(`when generate rejects`, () => {
          beforeEach(done => {
            generateReject(`Test Reason`)
            setTimeout(done, delay)
          })
          it(`does not call generate again`, () => expect(generate).toHaveBeenCalledTimes(1))
          it(`does not call cleanUp again`, () => expect(cleanUp).toHaveBeenCalledTimes(1))
          it(`rejects the returned promise`, () => expectAsync(returnedPromise).toBeRejectedWith(`Test Reason`))
        })
      })
      describe(`when cleanUp rejects`, () => {
        beforeEach(done => {
          cleanUpReject(`Test Reason`)
          setTimeout(done, delay)
        })
        it(`does not call generate`, () => expect(generate).not.toHaveBeenCalled())
        it(`does not call cleanUp again`, () => expect(cleanUp).toHaveBeenCalledTimes(1))
        it(`rejects the returned promise`, () => expectAsync(returnedPromise).toBeRejectedWith(`Test Reason`))
      })
    })
  })
})
