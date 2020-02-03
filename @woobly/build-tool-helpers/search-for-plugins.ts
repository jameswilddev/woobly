import * as fs from "fs"
import * as path from "path"
import listAllDependencies from "./list-all-dependencies"
import SearchedPlugin from "./searched-plugin"

export default async function (): Promise<ReadonlyArray<SearchedPlugin>> {
  const dependencies = await listAllDependencies()

  const output: SearchedPlugin[] = []

  for (const dependency of dependencies) {
    const scoped = /@([^\/]+)\/([^\/]+)$/.exec(dependency)

    const dependencyLocation = scoped === null ? path.join(`node_modules`, dependency) : path.join(`node_modules`, `@${scoped[1]}`, scoped[2])
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
      readonly version: string
      readonly wooblyPlugin?: {
        readonly fileExtension: string
      }
    } = JSON.parse(dependencyPackageJsonText)

    if (dependencyPackageJson.wooblyPlugin) {
      const fileExtension = dependencyPackageJson.wooblyPlugin.fileExtension

      const existing = output.find(existing => existing.fileExtension === fileExtension)

      if (existing !== undefined) {
        throw new Error(`Plugins "${existing.name}" and "${dependency}" are in conflict with regards to file extension "${fileExtension}".  Please ensure that no two plugins handle the same file extension.`)
      }

      output.push({
        name: dependency,
        cacheKeyPrefix: scoped === null ? `${dependency}@${dependencyPackageJson.version}` : `${scoped[1]}@${scoped[2]}@${dependencyPackageJson.version}`,
        fileExtension: dependencyPackageJson.wooblyPlugin.fileExtension,
        instance: require(`${path.join(process.cwd(), `node_modules`, dependency)}`),
      })
    }
  }

  return output
}
