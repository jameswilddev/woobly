type Plugin = (
  sourceFilePath: string,
  cacheDirectory: string,
) => Promise<{
  readonly generatedTypeScript: string
}>

export default Plugin
