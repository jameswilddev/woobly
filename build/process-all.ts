import * as fs from "fs"
import processPackage from "./process-package"

export default async function (): Promise<void> {
  await processPackage([`woobly`])

  console.log(`Checking namespaced packages...`)
  for (const name of await fs.promises.readdir(`@woobly`)) {
    await processPackage([`@woobly`, name])
  }
}
