import * as fs from "fs"

export default async function listAllDependencies(
): Promise<ReadonlyArray<string>> {
  let packageJsonText: string

  try {
    packageJsonText = await fs.promises.readFile(`package.json`, `utf8`)
  } catch (e) {
    if (e.code === `ENOENT`) {
      throw new Error(`Failed to find the "package.json" file.  Please ensure that the current working directory is the root of the project.`)
    }
    throw e
  }

  const packageJson: {
    readonly dependencies?: { readonly [key: string]: string }
  } = JSON.parse(packageJsonText)

  return Object
    .keys(packageJson.dependencies || {})
    .sort()
}
