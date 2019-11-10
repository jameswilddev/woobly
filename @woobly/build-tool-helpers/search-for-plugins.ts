import * as fs from "fs"
import * as path from "path"
import listAllDependencies from "./list-all-dependencies"

export default async function (): Promise<{
  readonly [fileExtension: string]: string
}> {
  const dependencies = await listAllDependencies()

  const output: { [fileExtension: string]: string } = {}

  for (const dependency of dependencies) {
    const dependencyLocation = path.join(`node_modules`, dependency)
    const dependencyPackageJsonLocation = path.join(dependencyLocation, `package.json`)

    let dependencyPackageJsonText: string

    try {
      dependencyPackageJsonText = await fs.promises.readFile(dependencyPackageJsonLocation, `utf8`)
    } catch (e) {
      if (e.code === `ENOENT`) {
        try {
          await fs.promises.access(dependencyLocation)
        } catch (e) {
          try {
            await fs.promises.access(`node_modules`)
          } catch (e) {
            throw new Error(`The "node_modules" directory is missing.  Please ensure that dependencies have been installed (execute "npm install").`)
          }
          throw new Error(`Dependency "${dependency}" is missing from the "node_modules" directory.  Please ensure that dependencies have been installed (execute "npm install").`)
        }
        throw new Error(`Dependency "${dependency}" is missing its "package.json" file.  Please ensure that dependencies have been installed (execute "npm install").`)
      }
      throw e
    }

    const dependencyPackageJson: {
      readonly wooblyPlugin?: {
        readonly fileExtension: string
      }
    } = JSON.parse(dependencyPackageJsonText)

    if (dependencyPackageJson.wooblyPlugin) {
      if (Object.prototype.hasOwnProperty.call(output, dependencyPackageJson.wooblyPlugin.fileExtension)) {
        throw new Error(`Plugins "${output[dependencyPackageJson.wooblyPlugin.fileExtension]}" and "${dependency}" are in conflict with regards to file extension "${dependencyPackageJson.wooblyPlugin.fileExtension}".  Please ensure that no two plugins handle the same file extension.`)
      }

      output[dependencyPackageJson.wooblyPlugin.fileExtension] = dependency
    }
  }

  return output
}
