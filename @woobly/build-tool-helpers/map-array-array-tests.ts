import { mapArrayArray } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`mapArrayArray`, () => {
    const callback = jasmine
      .createSpy(`callback`)
      .and
      .callFake(async (input: string): Promise<number> => {
        switch (input) {
          case `Test Input A`:
            return 5

          case `Test Input B`:
            return 3

          case `Test Input C`:
            return 7

          default:
            throw new Error(`Unexpected input "${input}".`)
        }
      })

    beforeEach(() => callback.calls.reset())

    describe(`given no input`, () => {
      let result: ReadonlyArray<number>
      beforeEach(async () => {
        result = await mapArrayArray(`Test Message`, [], callback)
      })
      it(
        `does not execute the callback`,
        () => expect(callback).not.toHaveBeenCalled()
      )
      it(`returns an empty array`, () => expect(result).toEqual([]))
    })

    describe(`given input`, () => {
      let result: ReadonlyArray<number>
      beforeEach(async () => {
        result = await mapArrayArray(
          `Test Message`,
          [
            `Test Input A`,
            `Test Input B`,
            `Test Input C`
          ],
          callback
        )
      })
      it(
        `executes the callback once per item`,
        () => expect(callback).toHaveBeenCalledTimes(3)
      )
      it(`executes the callback once for each item`, () => {
        expect(callback).toHaveBeenCalledWith(`Test Input A`)
        expect(callback).toHaveBeenCalledWith(`Test Input B`)
        expect(callback).toHaveBeenCalledWith(`Test Input C`)
      })
      it(
        `returns the outputs in order`,
        () => expect(result).toEqual([5, 3, 7])
      )
    })

    // Unfortunately, the console log output is nondeterministic and cannot be
    // asserted upon.
  })
})
