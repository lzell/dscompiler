// This file defines a strict subset of Figma's Plugin API.
// Browse the full plugin API at:
//
//   node_modules/@figma/plugin-typings/index.d.ts
//   node_modules/@figma/plugin-typings/plugin-api.d.ts
//
// We duplicate parts of the API definition for dependency isolation.
// Source code under `src/core` can run outside of Figma's plugin environment.
// It also serves as a reference to quickly see which parts of the plugin API we use.
//
// Type names are almost have `Protocol` appended to them to distinguish them from
// from Figma's plugin types. The idea is that call sites can use a type
// passed from Figma, or from one of our own creation that conforms to <FigmaType>Protocol
// that we craft ourselves, which is helpful for testing.
export interface PluginAPIProtocol {
  getLocalPaintStyles(): PaintStyle[]
}

export interface PaintStyleProtocol {
   name: string
   description: string
   paints: ReadonlyArray<PaintProtocol>
}

export interface RGBProtocol {
  readonly r: number
  readonly g: number
  readonly b: number
}

export interface SolidPaintProtocol {
  readonly type: 'SOLID'
  readonly color: RGBProtocol
  readonly opacity?: number
}

export interface VideoPaintProtocol {
  readonly type: 'VIDEO'
}

export interface ImagePaintProtocol {
  readonly type: 'IMAGE'
}

export interface GradientPaintProtocol {
  readonly type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND'
}

export declare type PaintProtocol = SolidPaintProtocol | GradientPaintProtocol | ImagePaintProtocol | VideoPaintProtocol
