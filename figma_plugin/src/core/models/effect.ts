import { Color } from 'src/core/models/color.ts'

// A NamedCompositeEffect can be composed of multiple sub-effects. For example,
// a named shadow effect may be composed of two shadows with different offsets and colors.
export type NamedCompositeEffect = {
  readonly name: string
  readonly description: string
  readonly effects: ReadonlyArray<DSEffect>
}

// Prefix with DS to avoid confusion with Figma's Effect type
export type DSEffect = Shadow | Blur

export type Shadow = {
  color: Color
  radius: number
  offset: { x: number, y: number }
}

export type Blur = {
  radius: number
}
