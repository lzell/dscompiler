// This file defines a strict subset of Figma's Plugin API.
// Browse the full plugin API at:
//
//   node_modules/@figma/plugin-typings/index.d.ts
//   node_modules/@figma/plugin-typings/plugin-api.d.ts
//
// We duplicate parts of the API definition for dependency isolation.
// Source code under `src/core` can run outside of Figma's plugin environment (e.g. in tests).
// It also serves as a reference to quickly see which parts of the plugin API we use.
//
// Type names have `I` prepended to them to distinguish them from
// from Figma's plugin types. The idea is that call sites can use a type
// passed from Figma, or from one of our own creation that conforms to I<FigmaType>
// that we craft ourselves, which is helpful for testing.
//
// If we did not declare a subset of the API, it would be unwieldy to craft tests,
// as we'd have to satisfy the full type contract defined by figma in our factories
// (which would include many members and methods that we do not use).
export interface IPluginAPI {
  getLocalPaintStyles(): IPaintStyle[]
}

export interface IPaintStyle {
   name: string
   description: string
   paints: ReadonlyArray<IPaint>
}

export interface IRGB {
  readonly r: number
  readonly g: number
  readonly b: number
}

export interface IRGBA extends IRGB {
  readonly a: number
}

export interface ISolidPaint {
  readonly type: 'SOLID'
  readonly color: IRGB
  readonly opacity?: number
}

export interface IVideoPaint {
  readonly type: 'VIDEO'
}

export interface IImagePaint {
  readonly type: 'IMAGE'
}

export declare type ITransform = [[number, number, number], [number, number, number]]

export interface IColorStop {
  readonly position: number
  readonly color: IRGBA
}

export interface IGradientPaint {
  readonly type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND'
  readonly gradientTransform: ITransform
  readonly gradientStops: ReadonlyArray<IColorStop>
  readonly opacity?: number
}

export declare type IPaint = ISolidPaint | IGradientPaint | IImagePaint | IVideoPaint
