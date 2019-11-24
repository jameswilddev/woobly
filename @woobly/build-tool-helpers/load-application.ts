import * as fs from "fs"
import * as path from "path"
import * as jsonschema from "jsonschema"
import ApplicationFilePath from "./application-file-path"
import Application from "./application"
import applicationJsonSchema from "./application-json-schema"

export default async function (
  filePath: ApplicationFilePath,
): Promise<Application> {
  const jsonFilePathFragments = [`src`]
    .concat(filePath.filePath.slice(0, filePath.filePath.length - 1))
    .concat([`${filePath.filePath[filePath.filePath.length - 1]}.application.json`])
  const jsonFilePath = path.join.apply(path, jsonFilePathFragments)
  const text = await fs.promises.readFile(jsonFilePath, `utf8`)
  const json = JSON.parse(text)

  const validation = jsonschema.validate(json, applicationJsonSchema)
  if (!validation.valid) {
    const errors = validation
      .errors
      .map(e => `\n\t${e.property} - ${e.message}`)
      .join(``)
    throw new Error(`Application JSON "${jsonFilePath}" is not valid; the following errors were detected:${errors}`)
  }

  return json
}
