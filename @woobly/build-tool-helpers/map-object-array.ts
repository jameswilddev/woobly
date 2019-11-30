import * as Progress from "progress"

export default async function <TInput, TOutput>(
  message: string,
  input: { readonly [key: string]: TInput },
  callback: (key: string, value: TInput) => Promise<TOutput>,
): Promise<ReadonlyArray<TOutput>> {
  const entries = Object.entries(input).sort((a, b) => a[0].localeCompare(b[0]))

  if (!entries.length) {
    return []
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

  const output: TOutput[] = []

  for (const entry of entries) {
    const result = await callback(entry[0], entry[1])
    output.push(result)
    bar.tick()
  }

  return output
}
