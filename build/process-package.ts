import writeReadme from "./write-readme"
import readPackageJson from "./read-package-json"
import copyLicense from "./copy-license"
import writePackageJson from "./write-package-json"

export default async function (
  name: ReadonlyArray<string>
): Promise<void> {
  console.log(`Processing package "${name.join(`/`)}"...`)
  const originalPackageJson = await readPackageJson(name)
  await writeReadme(name, originalPackageJson.description)
  await copyLicense(name)
  await writePackageJson(name, originalPackageJson)
}
