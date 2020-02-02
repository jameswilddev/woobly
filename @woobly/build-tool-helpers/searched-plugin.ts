import * as wooblyPluginHelpers from "@woobly/plugin-helpers"

type SearchedPlugin = {
  readonly name: string
  readonly cacheKeyPrefix: string
  readonly fileExtension: string
  readonly instance: wooblyPluginHelpers.Plugin
}

export default SearchedPlugin
