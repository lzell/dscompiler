import { Color } from 'src/core/models/color.ts'

export type NamedCompositeEffect = {
  readonly name: string
  readonly description: string
  readonly effects: ReadonlyArray<DSEffect>
}

// Prefix with DS to avoid collision with Figma's Effect type
export type DSEffect = Shadow | Blur

export type Shadow = {
  color: Color
  radius: number
  offset: { x: number, y: number }
  spread: number | null
}

export type Blur = {
  radius: number
}
