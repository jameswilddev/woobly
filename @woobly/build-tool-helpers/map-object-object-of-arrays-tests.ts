import { mapObjectObjectOfArrays } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`mapObjectObjectOfArrays`, () => {
    describe(`given no input`, () => {
      let result: { readonly [key: string]: ReadonlyArray<string> }
      beforeEach(() => {
        result = mapObjectObjectOfArrays({})
      })
      it(`returns an empty object`, () => expect(result).toEqual({}))
    })
    describe(`given input`, () => {
      let result: { readonly [key: string]: ReadonlyArray<string> }
      beforeEach(() => {
        result = mapObjectObjectOfArrays({
          "Test Key A": `Test Value A`,
          "Test Key B": `Test Value A`,
          "Test Key C": `Test Value B`,
          "Test Key D": `Test Value A`,
          "Test Key E": `Test Value C`,
          "Test Key F": `Test Value B`
        })
      })
      it(`returns the grouped keys`, () => expect(result).toEqual({
        "Test Value A": [`Test Key A`, `Test Key B`, `Test Key D`],
        "Test Value B": [`Test Key C`, `Test Key F`],
        "Test Value C": [`Test Key E`],
      }))
    })
  })
})
