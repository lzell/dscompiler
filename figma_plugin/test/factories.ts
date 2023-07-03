import { IColorStop } from '../src/core/origins/figma/api_bridge.ts'
import { IDropShadowEffect } from '../src/core/origins/figma/api_bridge.ts'
import { IEffect } from '../src/core/origins/figma/api_bridge.ts'
import { IEffectStyle } from '../src/core/origins/figma/api_bridge.ts'
import { IGradientPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IInnerShadowEffect } from '../src/core/origins/figma/api_bridge.ts'
import { IPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from '../src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from '../src/core/origins/figma/api_bridge.ts'
import { IRGBA } from '../src/core/origins/figma/api_bridge.ts'
import { ISolidPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IBlurEffect } from '../src/core/origins/figma/api_bridge.ts'
import { ITransform } from '../src/core/origins/figma/api_bridge.ts'

/* Plugin API Factory */
interface _IPluginAPI {
  getLocalPaintStyles?: () => IPaintStyle[]
  getLocalEffectStyles?: () => IEffectStyle[]
}

export function makePluginAPI({ getLocalPaintStyles, getLocalEffectStyles }: _IPluginAPI = {})
: IPluginAPI {
  return {
    getLocalPaintStyles: getLocalPaintStyles || jest.fn(() => { return Array<IPaintStyle>() }),
    getLocalEffectStyles: getLocalEffectStyles || jest.fn(() => { return Array<IEffectStyle>() }),
  }
}

/* PaintStyle Factory */
interface _IPaintStyle {
  name?: string
  description?: string
  paints?: ReadonlyArray<IPaint>
}

export function makePaintStyle({ name, description, paints }: _IPaintStyle = {})
: IPaintStyle {
  return {
    name: name || "default color",
    description: description || "default description",
    paints: paints || [makePaint()]
  }
}

/* SolidPaint Factory */
function makePaint(): ISolidPaint {
  return {type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.5}
}


/* GradientPaint Factory */
interface _IGradientPaint {
  type?: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND'
  gradientTransform?: ITransform
  gradientStops?: ReadonlyArray<IColorStop>
  opacity?: number
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


/* EffectStyle Factory */

interface _IEffectStyle {
  name?: string
  description?: string
  effects?: ReadonlyArray<IEffect>
}

export function makeEffectStyle({ name, description, effects }: _IEffectStyle = {})
: IEffectStyle {
  return {
    name: name || "default effect",
    description: description || "default description",
    effects: effects || [makeDropShadowEffect()]
  }
}


/* Shadow Factories */
interface _IDropShadowEffect {
  readonly color?: IRGBA
  readonly offset?: {x: number, y: number}
  readonly radius?: number
  readonly spread?: number
}

export function makeDropShadowEffect({ color, offset, radius, spread }: _IDropShadowEffect = {})
: IDropShadowEffect {
  return {
    type: 'DROP_SHADOW',
    color: color || {r: 0, g: 0, b: 0, a: 1},
    offset: offset || {x: 3, y: 3},
    radius: radius !== undefined ? radius : 5,
    spread: spread
  }
}

export function makeInnerShadowEffect(): IInnerShadowEffect {
  return {type: 'INNER_SHADOW'}
}

/* Blur Factories */
export function makeBackgroundBlurEffect(): IBlurEffect {
  return {type: 'BACKGROUND_BLUR', radius: 10}
}

export function makeLayerBlurEffect({radius}: {radius?: number} = {}): IBlurEffect {
  return {type: 'LAYER_BLUR', radius: radius !== undefined ? radius : 10 }
}
