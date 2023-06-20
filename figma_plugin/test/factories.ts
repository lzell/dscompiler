import { IColorStop } from '../src/core/origins/figma/api_bridge.ts'
import { IGradientPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from '../src/core/origins/figma/api_bridge.ts'
import { ISolidPaint } from '../src/core/origins/figma/api_bridge.ts'
import { ITransform } from '../src/core/origins/figma/api_bridge.ts'


interface _IPaintStyle {
  name?: string
  description?: string
  paints?: ReadonlyArray<IPaint>
}

interface _IGradientPaint {
  type?: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND'
  gradientTransform?: ITransform
  gradientStops?: ReadonlyArray<IColorStop>
  opacity?: number
}

export function makePaintStyle({ name, description, paints }: _IPaintStyle = {})
: IPaintStyle {
  return {
    name: name || "default color",
    description: description || "default description",
    paints: paints || [makePaint()]
  }
}

function makePaint(): ISolidPaint {
  return {type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.5}
}

export function makeGradientPaint({ type, gradientTransform, gradientStops, opacity }: _IGradientPaint = {})
: IGradientPaint {
  return {
    type: type || 'GRADIENT_LINEAR',
    opacity: opacity || 1,
    gradientStops: gradientStops || makeGradientStops(),
    gradientTransform: gradientTransform || [[0,1,0], [-1,0,1]]}
}

function makeGradientStops(): ReadonlyArray<IColorStop> {
  const colorA = {r: 1, g: 0, b: 0, a: 1}
  const colorB = {r: 1, g: 1, b: 1, a: 0}
  return [{color: colorA, position: 0}, {color: colorB, position: 1}]
}
