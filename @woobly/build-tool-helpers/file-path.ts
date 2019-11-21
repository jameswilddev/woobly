import InvalidFilePath from "./invalid-file-path"
import TypeScriptFilePath from "./type-script-file-path"
import ContentFilePath from "./content-file-path"
import ApplicationFilePath from "./application-file-path"

type FilePath = {
  readonly invalid: InvalidFilePath
  readonly typeScript: TypeScriptFilePath
  readonly content: ContentFilePath
  readonly application: ApplicationFilePath
}

export default FilePath
