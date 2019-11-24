import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import { sha1File } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`sha1File`, () => {
    let dir: string
    beforeAll(async () => {
      dir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), `woobly-build-tool-helpers-sha-1-file-tests-`)
      )
    })

    afterAll(async () => {
      await fs.promises.rmdir(dir, { recursive: true })
    })

    describe(`when the file does not exist`, () => {
      it(`rethrows the error`, async () => expectAsync(
        sha1File(path.join(dir, `nonexistent-file`))
      ).toBeRejectedWith(jasmine.objectContaining({ code: `ENOENT` })))
    })

    describe(`when the file is empty`, () => {
      beforeAll(async () => {
        await fs.promises.writeFile(
          path.join(dir, `empty-file`),
          Buffer.from(new Uint8Array(0)),
        )
      })

      it(`returns the sha1 of the file`, async () => expectAsync(
        sha1File(path.join(dir, `empty-file`))
      ).toBeResolvedTo(`da39a3ee5e6b4b0d3255bfef95601890afd80709`))
    })

    describe(`when the file is non-empty`, () => {
      beforeAll(async () => {
        await fs.promises.writeFile(
          path.join(dir, `non-empty-file`),
          Buffer.from(new Uint8Array([23, 38, 112, 92, 10, 240, 199])),
        )
      })

      it(`returns the sha1 of the file`, async () => expectAsync(
        sha1File(path.join(dir, `non-empty-file`))
      ).toBeResolvedTo(`a9bfa7917fc69812c668f5a62aed8c85ee92da45`))
    })
  })
})
