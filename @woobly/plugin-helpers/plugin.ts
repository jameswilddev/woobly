type Plugin = (
  sourceFilePath: string,
  cacheDirectory: string,
) => {
  readonly generatedTypeScript: string
}

export default Plugin
