import * as fs from "fs"
import * as path from "path"
import * as jsonschema from "jsonschema"
import applicationJsonSchema from "./application-json-schema"
import tryToFindContentDetailsFromFilePath from "./try-to-find-content-details-from-file-path"
import sha1File from "./sha1-file"

export default async function (
  plugins: { readonly [fileExtension: string]: string },
  filePath: string,
): Promise<
  | {
    readonly type: `typeScript`
    readonly filePath: string
  }
  | {
    readonly type: `content`
    readonly filePath: string
    readonly plugin: string
    readonly typeScriptIdentifier: string
    readonly sha1: string
  }
  | {
    readonly type: `application`
    readonly filePath: ReadonlyArray<string>
    readonly sha1: string
    readonly logoSha1: string
    readonly json: {
      readonly entry: string
      readonly logo: {
        readonly filePath: ReadonlyArray<string>
        readonly pixelArt: boolean
        readonly backgroundColor: string
      }
      readonly application: {
        readonly name: {
          readonly long: string
          readonly short: string
        }
        readonly description: string
        readonly language: string
        readonly version: string
        readonly color: string
        readonly appleStatusBarStyle: `default` | `black` | `blackTranslucent`
        readonly display: `standalone` | `fullScreen` | `minimalUi` | `browser`
        readonly orientation: `any` | `natural` | `portrait` | `landscape`
      }
      readonly developer: {
        readonly name: string
        readonly website: string
      }
    }
  }
> {
  if (filePath.endsWith(`.ts`)) {
    return {
      type: `typeScript`,
      filePath,
    }
  }

  if (filePath.endsWith(`.application.json`)) {
    const text = await fs.promises.readFile(filePath, `utf8`)
    const json = JSON.parse(text)
    const validation = jsonschema.validate(json, applicationJsonSchema)

    if (!validation.valid) {
      const errors = validation
        .errors
        .map(e => `\n\t${e.property} - ${e.message}`)
        .join(``)
      throw new Error(`Application JSON "${filePath}" is not valid; the following errors were detected:${errors}`)
    }

    return {
      type: `application`,
      filePath: filePath.slice(3 + path.sep.length, -17).split(path.sep),
      sha1: await sha1File(filePath),
      logoSha1: await sha1File(path.join.apply(path, json.logo.filePath)),
      json,
    }
  }

  const contentDetails = tryToFindContentDetailsFromFilePath(filePath)

  if (contentDetails === null) {
    throw new Error(`Unable to determine the purpose of file "${filePath}".  If this is intended to be content, please ensure that it is of the form described in the documentation.`)
  }

  if (!Object.prototype.hasOwnProperty.call(plugins, contentDetails.fileExtension)) {
    let pluginFileExtensionList: string

    if (Object.keys(plugins).length) {
      const list = Object
        .entries(plugins)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(plugin => `"${plugin[0]}" (from plugin "${plugin[1]}")`)
        .join(`, `)
      pluginFileExtensionList = `Plugins are installed for the following file extensions: ${list}`
    } else {
      pluginFileExtensionList = `There are no plugins installed`
    }

    throw new Error(`No installed plugin handles files with the extension "${contentDetails.fileExtension}" (from file "${filePath}").  Please ensure that the required plugin is installed, and that this file's extension is correct.  ${pluginFileExtensionList}; execute "npm install --save-dev {plugin name}" to install plugins.`)
  }

  return {
    type: `content`,
    filePath,
    plugin: plugins[contentDetails.fileExtension],
    typeScriptIdentifier: contentDetails.typeScriptIdentifier,
    sha1: await sha1File(filePath),
  }
}
