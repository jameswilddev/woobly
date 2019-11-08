import * as fs from "fs"
import * as path from "path"

export default async function (
  name: string,
): Promise<{
  readonly description: string
  readonly version: string
  readonly dependencies?: { readonly [name: string]: string }
  readonly bin?: { readonly [name: string]: string }
}> {
  console.log(`Reading package.json...`)
  const packageJsonPath = path.join(`@woobly`, name, `meta`, `package.json`)
  const packageJson = await fs.promises.readFile(packageJsonPath, `utf8`)
  return JSON.parse(packageJson)
}
