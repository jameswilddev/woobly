import * as fs from "fs"
import * as path from "path"

export default async function (
  name: string
): Promise<void> {
  console.log(`Copying license...`)
  await fs.promises.copyFile(`license`, path.join(`@woobly`, name, `license`))
}
