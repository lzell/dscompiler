import { camelCase } from 'lodash';
import { PluginAPIProvider } from './plugin_api_provider.ts'

export interface Color {
  readonly name: string
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly opacity: number
}

export function getColors(figmaProvider: PluginAPIProvider): Promise<Color[]> {
  return new Promise((resolve, reject) => {
    // TODO: Do a runtime check here to ensure that I have types of SolidPaint, not any of the other subtypes of Paint
    resolve(figmaProvider.getLocalPaintStyles().map(paintStyleToColor))
  })
}

// TODO: Fix any
function paintStyleToColor(paintStyle: PaintStyle): Color {
  console.assert(paintStyle.paints.length > 0)
  const paint = paintStyle.paints[0] as SolidPaint
  return {
    name: camelCase(paintStyle.name),
    red: paint.color.r,
    green: paint.color.g,
    blue: paint.color.b,
    opacity: paint.opacity ?? 1
  }
}
