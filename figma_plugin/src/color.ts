import { camelCase } from 'lodash';
import { FigmaProvider } from './figma_provider.ts'

// https://www.typescriptlang.org/play#example/assertion-functions
declare function assert(value: unknown): asserts value;

export interface Color {
  readonly name: string
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly opacity: number
}

export function getColors(figmaProvider: FigmaProvider): Promise<Color[]> {
  return new Promise((resolve, reject) => {
    resolve(figmaProvider.getLocalPaintStyles().map(paintStyleToColor))
  })
}

// TODO: Fix any
function paintStyleToColor(paintStyle: PaintStyle): Color {
  assert(paintStyle.paints.count > 0)
  const paint = paintStyle.paints[0]
  return {
    name: camelCase(paintStyle.name),
    red: paint.color.r,
    green: paint.color.g,
    blue: paint.color.b,
    opacity: paint.opacity
  }
}
