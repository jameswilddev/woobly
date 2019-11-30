import * as Progress from "progress"

export default async function <TInput, TOutput>(
  message: string,
  input: ReadonlyArray<TInput>,
  callback: (item: TInput) => Promise<readonly [string, TOutput]>,
): Promise<{ readonly [key: string]: TOutput }> {
  if (!input.length) {
    return {}
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

  const output: { [key: string]: TOutput } = {}

  for (const item of input) {
    const result = await callback(item)
    output[result[0]] = result[1]
    bar.tick()
  }

  return output
}
