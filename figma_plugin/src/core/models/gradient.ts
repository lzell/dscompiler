import { Color } from 'src/core/models/color.ts'
import { Point } from 'src/core/models/point.ts'

export type GradientStop = {
  color: Color
  location: number
}

export type LinearGradient = {
  stops: ReadonlyArray<GradientStop>
  startPoint: Point
  endPoint: Point
}

export type NamedGradient = LinearGradient & {
  readonly name: string
  readonly description: string
}
