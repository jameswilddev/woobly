import * as Progress from "progress"

export default async function <TInput, TOutput>(
  message: string,
  input: ReadonlyArray<TInput>,
  callback: (item: TInput) => Promise<TOutput>,
): Promise<ReadonlyArray<TOutput>> {
  if (!input.length) {
    return []
  }

  const bar = new Progress(
    `:message :bar :current/:total (:percent) :etas`,
    {
      width: 80,
      total: input.length,
    }
  )

  bar.render({
    message,
  })

  const output: TOutput[] = []

  for (const item of input) {
    const result = await callback(item)
    output.push(result)
    bar.tick()
  }

  return output
}
