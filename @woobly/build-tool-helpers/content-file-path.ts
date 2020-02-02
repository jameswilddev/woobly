import SearchedPlugin from "./searched-plugin"

type ContentFilePath = {
  readonly filePath: string
  readonly plugin: SearchedPlugin
  readonly typeScriptIdentifier: string
}

export default ContentFilePath
