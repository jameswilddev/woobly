
type Values<T> = T[keyof T]

type MapOne<T> = Values<{
  readonly [TKey in keyof T]: {
    readonly type: TKey
  } & T[TKey]
}>

export default MapOne
