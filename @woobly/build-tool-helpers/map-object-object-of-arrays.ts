export default function (
  input: { readonly [key: string]: string },
): { readonly [key: string]: ReadonlyArray<string> } {
  const output: { [key: string]: string[] } = {}

  for (const key of Object.keys(input).sort()) {
    const value = input[key]

    if (!Object.prototype.hasOwnProperty.call(output, value)) {
      output[value] = []
    }

    output[value].push(key)
  }

  return output
}
