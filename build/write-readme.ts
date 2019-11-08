import * as fs from "fs"
import * as path from "path"
import generateReadme from "./generate-readme"

export default async function (
  name: string,
  description: string,
): Promise<void> {
  console.log(`Writing readme...`)
  await fs.promises.writeFile(
    path.join(`@woobly`, name, `readme.md`),
    generateReadme(name, description),
  )
}
