import { camelCase } from 'lodash';

// https://www.typescriptlang.org/play#example/assertion-functions
declare function assert(value: unknown): asserts value;

export interface Color {
  readonly name: string | null
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly opacity: number
}

export function getColors(): Promise<Color[]> {
  return new Promise((resolve, reject) => {
    resolve(figma.getLocalPaintStyles().map(paintStyleToColor))
  })
}

// TODO: Fix any
function paintStyleToColor(paintStyle: any): Color {
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
