import { camelCase } from 'lodash'
import { compact } from 'lodash'
import { extractLinearGradientParamsFromTransform } from "@figma-plugin/helpers"

// API bridge types
import { IGradientPaint } from 'src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from 'src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'
import { ITransform } from 'src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { GradientStop } from 'src/core/models/gradient.ts'
import { LinearGradient } from 'src/core/models/gradient.ts'
import { NamedGradient } from 'src/core/models/gradient.ts'
import { Point } from 'src/core/models/point.ts'
import { logToUser } from 'src/core/utils/log.ts'

function onlyLinearGradientPaintStyles(paintStyle: IPaintStyle): boolean {
  const hasPaints = paintStyle.paints.length >= 1
  return hasPaints && paintStyle.paints[0].type === 'GRADIENT_LINEAR'
}

// Given Figma's 'plugin' global, returns an array of NamedGradient models.
// Every linear gradient paint saved as a "local style" in Figma is mapped to a NamedGradient.
export function inferGradients(figma: IPluginAPI): ReadonlyArray<NamedGradient> {
  return compact(figma.getLocalPaintStyles()
                 .filter(onlyLinearGradientPaintStyles)
                 .map(paintStyleToLinearGradient))
}

// Given a paint style consisting of a linear gradient, return a NamedGradient model.
// The name of the paint style is camelCased to form the NamedGradient model name.
export function paintStyleToLinearGradient(paintStyle: IPaintStyle): NamedGradient {
  console.assert(paintStyle.paints.length == 1, "Expected paint styles to have exactly one paint")
  console.assert(paintStyle.paints[0].type == 'GRADIENT_LINEAR', "Expected paint style to have a linear gradient paint")
  const paint = paintStyle.paints[0] as IGradientPaint
  if (paint.opacity != 1) {
    logToUser("DSCompiler expects gradient opacities to be applied to color stops, not the overall gradient")
  }
  const gradient = gradientPaintToLinearGradient(paint)
  const named = {name: camelCase(paintStyle.name), description: paintStyle.description}
  return { ...named, ...gradient }
}

function gradientPaintToLinearGradient(gradientPaint: IGradientPaint): LinearGradient {

  const points = transformToModelCoordinates(gradientPaint.gradientTransform)
  const stops: GradientStop[] = gradientPaint.gradientStops.map(stop => {
    return {
      color: { red: stop.color.r, green: stop.color.g, blue: stop.color.b, opacity: stop.color.a },
      location: stop.position
    }
  })
  return {
    stops: stops,
    ...points
  }
}

export function transformToModelCoordinates(transform: ITransform): {startPoint: Point, endPoint: Point} {
  const tmp = extractLinearGradientParamsFromTransform(1, 1, transform)
  return { startPoint: {x: tmp.start[0], y: tmp.start[1]}, endPoint: {x:tmp.end[0], y: tmp.end[1]} }
}
