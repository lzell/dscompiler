export type Color = {
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly opacity?: number
}

export type NamedColor = Color & {
  readonly name: string
  readonly description: string
}
