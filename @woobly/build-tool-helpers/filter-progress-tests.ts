import { filterProgress } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`filterProgress`, () => {
    const callback = jasmine
      .createSpy(`callback`)
      .and
      .callFake(async (input: string): Promise<boolean> => {
        switch (input) {
          case `Test Input A`:
            return false

          case `Test Input B`:
            return true

          case `Test Input C`:
            return false

          case `Test Input D`:
            return false

          case `Test Input E`:
            return true

          default:
            throw new Error(`Unexpected input "${input}".`)
        }
      })

    beforeEach(() => callback.calls.reset())

    describe(`given no input`, () => {
      let result: ReadonlyArray<number>
      beforeEach(async () => {
        result = await filterProgress(`Test Message`, [], callback)
      })
      it(
        `does not execute the callback`,
        () => expect(callback).not.toHaveBeenCalled()
      )
      it(`returns an empty array`, () => expect(result).toEqual([]))
    })

    describe(`given input`, () => {
      let result: ReadonlyArray<string>
      beforeEach(async () => {
        result = await filterProgress(
          `Test Message`,
          [
            `Test Input A`,
            `Test Input B`,
            `Test Input C`,
            `Test Input D`,
            `Test Input E`,
          ],
          callback,
        )
      })
      it(
        `executes the callback once per item`,
        () => expect(callback).toHaveBeenCalledTimes(5)
      )
      it(`executes the callback once for each item`, () => {
        expect(callback).toHaveBeenCalledWith(`Test Input A`)
        expect(callback).toHaveBeenCalledWith(`Test Input B`)
        expect(callback).toHaveBeenCalledWith(`Test Input C`)
        expect(callback).toHaveBeenCalledWith(`Test Input D`)
        expect(callback).toHaveBeenCalledWith(`Test Input E`)
      })
      it(
        `returns the filtered set in order`,
        () => expect(result).toEqual([`Test Input B`, `Test Input E`])
      )
    })

    // Unfortunately, the console log output is nondeterministic and cannot be
    // asserted upon.
  })
})
