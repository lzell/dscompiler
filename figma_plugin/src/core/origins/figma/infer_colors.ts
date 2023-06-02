import { camelCase } from 'lodash'
import { compact } from 'lodash'
import { PaintProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { PaintStyleProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { PluginAPIProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { SolidPaintProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { Color } from 'src/core/models/color.ts'

// Given Figma's 'plugin' global, returns an array of Color models.
// Colors are mapped from Figma's PaintStyle type to our Color type.
export function inferColors(figma: PluginAPIProtocol): ReadonlyArray<Color> {
  return compact(figma.getLocalPaintStyles().map(paintStyleToColor))
}

// Given a paint style, return a Color model if we can.
// The only supported PaintStyle type right now is `SolidPaint`.
// All other paint styles are ignored.
// The name of the paint style is camelCased to form the Color model name.
export function paintStyleToColor(paintStyle: PaintStyleProtocol): Color | null {
  console.assert(paintStyle.paints.length > 0, "Expected paint styles to have at least one paint")
  const isSolid = (paint: PaintProtocol): paint is SolidPaintProtocol => paint.type === "SOLID"
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
