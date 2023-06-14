import { camelCase } from 'lodash'
import { compact } from 'lodash'
import { IPaint } from 'src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from 'src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'
import { ISolidPaint } from 'src/core/origins/figma/api_bridge.ts'
import { Color } from 'src/core/models/color.ts'

// Given Figma's 'plugin' global, returns an array of Color models.
// Colors are mapped from Figma's PaintStyle type to our Color type.
export function inferColors(figma: IPluginAPI): ReadonlyArray<Color> {
  return compact(figma.getLocalPaintStyles().map(paintStyleToColor))
}

// Given a paint style, return a Color model if we can.
// The only supported PaintStyle type right now is `SolidPaint`.
// All other paint styles are ignored.
// The name of the paint style is camelCased to form the Color model name.
export function paintStyleToColor(paintStyle: IPaintStyle): Color | null {
  console.assert(paintStyle.paints.length > 0, "Expected paint styles to have at least one paint")
  const isSolid = (paint: IPaint): paint is ISolidPaint => paint.type === "SOLID"
  const paint = paintStyle.paints.find(isSolid)
  if (paint) {
    return {
      name: camelCase(paintStyle.name),
      description: paintStyle.description,
      red: paint.color.r,
      green: paint.color.g,
      blue: paint.color.b,
      opacity: paint.opacity ?? 1
    }
  }
  return null
}
