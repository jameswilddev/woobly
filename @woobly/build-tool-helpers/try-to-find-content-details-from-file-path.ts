export default function (
  filePath: string,
): null | {
  readonly typeScriptIdentifier: string
  readonly fileExtension: string
} {
  if (!/^src[\\\/][a-z$_][a-z$_0-9]*(?:[-\\\/][a-z$_0-9]+)*(?:\.[^\\\/.]+)+$/.test(filePath)) {
    return null
  }

  const segments = filePath
    .split(`.`)[0]
    .split(/[\\\/-]/g)
    .slice(1)

  const pascalCasedSegments = segments
    .slice(1)
    .map(segment => `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`)

  const typeScriptIdentifier = `${segments[0]}${pascalCasedSegments.join(``)}`

  const fileExtension = filePath
    .split(`.`)
    .slice(1)
    .join(`.`)

  return {
    typeScriptIdentifier,
    fileExtension,
  }
}
