import { compact } from 'lodash'

// API bridge types
import { IPaintStyle } from 'src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'
import { ISolidPaint } from 'src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { Color } from 'src/core/models/color.ts'
import { NamedColor } from 'src/core/models/color.ts'
import { sanitizeName } from 'src/core/utils/common.ts'

function onlySolidPaintStyles(paintStyle: IPaintStyle): boolean {
  const hasPaints = paintStyle.paints.length >= 1
  return hasPaints && paintStyle.paints[0].type === 'SOLID'
}

// Given Figma's 'plugin' global, returns an array of NamedColor models.
// Every solid paint saved as a "local style" in Figma is mapped to a NamedColor.
export function inferColors(figma: IPluginAPI): ReadonlyArray<NamedColor> {
  return compact(figma.getLocalPaintStyles()
                 .filter(onlySolidPaintStyles)
                 .map(paintStyleToColor))
}

// Given a paint style consisting of a solid paint, return a NamedColor model.
// The name of the paint style is camelCased to form the NamedColor model name.
export function paintStyleToColor(paintStyle: IPaintStyle): NamedColor {
  console.assert(paintStyle.paints.length == 1, "Expected paint styles to have exactly one paint")
  console.assert(paintStyle.paints[0].type == 'SOLID', "Expected paint style to have a solid paint")
  const paint: ISolidPaint = paintStyle.paints[0] as ISolidPaint
  const color = solidPaintToColor(paint)
  const named = {name: sanitizeName(paintStyle.name), description: paintStyle.description}
  return { ...named, ...color }
}

function solidPaintToColor(solidPaint: ISolidPaint): Color {
  return {
    red: solidPaint.color.r,
    green: solidPaint.color.g,
    blue: solidPaint.color.b,
    opacity: solidPaint.opacity ?? 1
  }
}
