import * as fs from "fs"
import * as path from "path"
import filterProgress from "./filter-progress"
import mapArrayArray from "./map-array-array"

export default async function (
  basePath: ReadonlyArray<string>,
  lastFileWritten: string,
): Promise<ReadonlyArray<string>> {
  const joinedBasePath = path.join.apply(path, basePath.slice())
  const keys = await fs.promises.readdir(joinedBasePath)

  const validKeys = await filterProgress(
    `Checking for incomplete cache items in "${joinedBasePath}"...`,
    keys,
    async key => {
      try {
        const stat = await fs.promises.stat(path.join(joinedBasePath, key, lastFileWritten))
        return stat.isFile()
      } catch {
        return false
      }
    }
  )

  const invalidKeys = keys.filter(key => !validKeys.includes(key))
  await mapArrayArray(
    `Deleting incomplete cache items in "${joinedBasePath}"...`,
    invalidKeys,
    key => fs.promises.rmdir(path.join(joinedBasePath, key), { recursive: true })
  )

  return validKeys
}
