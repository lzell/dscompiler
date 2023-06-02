import { camelCase } from 'lodash'
import { compact } from 'lodash'
import { PaintProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { PaintStyleProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { PluginAPIProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { SolidPaintProtocol } from 'src/core/origins/figma/api_bridge.ts'
import { Color } from 'src/core/models/color.ts'

export function inferColors(figma: PluginAPIProtocol): ReadonlyArray<Color> {
  return compact(figma.getLocalPaintStyles().map(paintStyleToColor))
}

export function paintStyleToColor(paintStyle: PaintStyleProtocol): Color | null {
  console.assert(paintStyle.paints.length > 0, "Expected paint styles to have at least one paint")
  const isSolid = (paint: PaintProtocol): paint is SolidPaintProtocol => paint.type === "SOLID";
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

