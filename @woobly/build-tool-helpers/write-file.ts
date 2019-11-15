import * as fs from "fs"
import * as path from "path"
import * as zopflipngBin from "zopflipng-bin"
import shellExecute from "./shell-execute"

export default async function (
  filePath: ReadonlyArray<string>,
  buffer: Buffer,
  production: Boolean,
): Promise<void> {
  const joined = path.join.apply(path, filePath.slice())

  if (production && joined.endsWith(`.png`)) {
    await fs.promises.writeFile(joined, buffer)
    await shellExecute(
      `zopfli compress PNG`,
      zopflipngBin,
      [`-m`, `--lossy_transparent`, `--lossy_8b`, joined],
    )
    return
  }

  if (production && joined.endsWith(`.json`)) {
    const text = buffer.toString()
    const json = JSON.parse(text)
    await fs.promises.writeFile(joined, JSON.stringify(json))
    return
  }

  await fs.promises.writeFile(joined, buffer)
}
