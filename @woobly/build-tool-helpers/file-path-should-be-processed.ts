export default function (
  filePath: string
): boolean {
  return !/(?:^|\\|\/)\./.test(filePath)
}
