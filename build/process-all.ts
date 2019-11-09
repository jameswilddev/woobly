import * as fs from "fs"
import processPackage from "./process-package"
import writeRootReadme from "./write-root-readme"

export default async function (): Promise<void> {
  console.log(`Ensuring that directory exists for stub package...`)
  await fs.promises.mkdir(`woobly`, { recursive: true })
  await processPackage([`woobly`])

  console.log(`Checking namespaced packages...`)
  for (const name of await fs.promises.readdir(`@woobly`)) {
    await processPackage([`@woobly`, name])
  }

  await writeRootReadme()
}
