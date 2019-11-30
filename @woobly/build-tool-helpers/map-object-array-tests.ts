import { mapObjectArray } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`mapObjectArray`, () => {
    const callback = jasmine
      .createSpy(`callback`)
      .and
      .callFake(async (key: string): Promise<number> => {
        switch (key) {
          case `Test Input A`:
            return 5

          case `Test Input B`:
            return 3

          case `Test Input C`:
            return 7

          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

    beforeEach(() => callback.calls.reset())

    describe(`given no input`, () => {
      let result: ReadonlyArray<number>
      beforeEach(async () => {
        result = await mapObjectArray(`Test Message`, {}, callback)
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
        result = await mapObjectArray(
          `Test Message`,
          {
            "Test Input A": true,
            "Test Input B": true,
            "Test Input C": false,
          },
          callback,
        )
      })
      it(
        `executes the callback once per item`,
        () => expect(callback).toHaveBeenCalledTimes(3),
      )
      it(`executes the callback once for each item`, () => {
        expect(callback).toHaveBeenCalledWith(`Test Input A`, true)
        expect(callback).toHaveBeenCalledWith(`Test Input B`, true)
        expect(callback).toHaveBeenCalledWith(`Test Input C`, false)
      })
      it(
        `returns the outputs in order`,
        () => expect(result).toEqual([5, 3, 7]),
      )
    })

    // Unfortunately, the console log output is nondeterministic and cannot be
    // asserted upon.
  })
})
