import * as Progress from "progress"

export default async function <TInput, TOutput>(
  message: string,
  input: { readonly [key: string]: TInput },
  callback: (key: string, value: TInput) => Promise<readonly [string, TOutput]>,
): Promise<{ readonly [key: string]: TOutput }> {
  const entries = Object.entries(input).sort((a, b) => a[0].localeCompare(b[0]))

  if (!entries.length) {
    return {}
  }

  const bar = new Progress(
    `:message :bar :current/:total (:percent) :etas`,
    {
      width: 80,
      total: entries.length,
    }
  )

  bar.render({
    message,
  })

  const output: { [key: string]: TOutput } = {}

  for (const entry of entries) {
    const result = await callback(entry[0], entry[1])
    output[result[0]] = result[1]
    bar.tick()
  }

  return output
}
