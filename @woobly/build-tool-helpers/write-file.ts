import * as fs from "fs"
import * as path from "path"
import isPng = require("is-png")
import * as zopflipngBin from "zopflipng-bin"
import shellExecute from "./shell-execute"

export default async function (
  filePath: ReadonlyArray<string>,
  buffer: Buffer,
  production: Boolean,
): Promise<void> {
  const joined = path.join.apply(path, filePath.slice())

  if (!production) {
    await fs.promises.writeFile(joined, buffer)
  }

  if (isPng(buffer)) {
    await fs.promises.writeFile(joined, buffer)
    await shellExecute(
      `zopfli compress PNG`,
      zopflipngBin,
      [`-m`, `--lossy_transparent`, `--lossy_8b`, joined],
    )

    return
  }

  const text = buffer.toString()
  let json: any = undefined

  try {
    json = JSON.parse(text)
  } catch (e) {
  }

  if (json !== undefined) {
    await fs.promises.writeFile(joined, JSON.stringify(json))
    return
  }

  await fs.promises.writeFile(joined, buffer)
}
