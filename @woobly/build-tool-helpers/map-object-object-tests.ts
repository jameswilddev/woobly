import { mapObjectObject } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`mapObjectObject`, () => {
    const callback = jasmine
      .createSpy(`callback`)
      .and
      .callFake(async (key: string): Promise<[string, number]> => {
        switch (key) {
          case `Test Input A`:
            return [`Test Output A`, 5]

          case `Test Input B`:
            return [`Test Output B`, 3]

          case `Test Input C`:
            return [`Test Output C`, 7]

          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })

    beforeEach(() => callback.calls.reset())

    describe(`given no input`, () => {
      let result: { readonly [key: string]: number }
      beforeEach(async () => {
        result = await mapObjectObject(`Test Message`, {}, callback)
      })
      it(
        `does not execute the callback`,
        () => expect(callback).not.toHaveBeenCalled()
      )
      it(`returns an empty object`, () => expect(result).toEqual({}))
    })

    describe(`given input`, () => {
      let result: { readonly [key: string]: number }
      beforeEach(async () => {
        result = await mapObjectObject(
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
        () => expect(callback).toHaveBeenCalledTimes(3)
      )
      it(`executes the callback once for each item`, () => {
        expect(callback).toHaveBeenCalledWith(`Test Input A`, true)
        expect(callback).toHaveBeenCalledWith(`Test Input B`, true)
        expect(callback).toHaveBeenCalledWith(`Test Input C`, false)
      })
      it(
        `returns the outputs`,
        () => expect(result).toEqual({
          "Test Output A": 5,
          "Test Output B": 3,
          "Test Output C": 7,
        })
      )
    })

    // Unfortunately, the console log output is nondeterministic and cannot be
    // asserted upon.
  })
})
