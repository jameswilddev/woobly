import * as Progress from "progress"

export default async function <T>(
  message: string,
  input: ReadonlyArray<T>,
  callback: (item: T) => Promise<boolean>,
): Promise<ReadonlyArray<T>> {
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

  const output: T[] = []

  for (const item of input) {
    const result = await callback(item)
    if (result) {
      output.push(item)
    }
    bar.tick()
  }

  return output
}
