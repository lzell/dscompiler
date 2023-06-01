import { camelCase, compact } from 'lodash';
import { PluginAPIProtocol } from './plugin_api_protocol.ts'

export interface Color {
  readonly name: string
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly opacity: number
}

export function getColors(figma: PluginAPIProtocol): Promise<Color[]> {
  return new Promise((resolve, reject) => {
    resolve(compact(figma.getLocalPaintStyles().map(paintStyleToColor)))
  })
}


function paintStyleToColor(paintStyle: PaintStyle): Color | null {
  console.assert(paintStyle.paints.length > 0, "Expected paint styles to have at least one paint")
  const isSolid = (paint: Paint): paint is SolidPaint => paint.type === "SOLID";
  const paint = paintStyle.paints.find(isSolid)
  if (paint) {
    return {
      name: camelCase(paintStyle.name),
      red: paint.color.r,
      green: paint.color.g,
      blue: paint.color.b,
      opacity: paint.opacity ?? 1
    }
  }
  return null
}
