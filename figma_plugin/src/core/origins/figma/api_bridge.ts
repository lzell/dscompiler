// Aids in testing. Can create test doubles that function like figma's
// PluginAPI This should be a strict subset of PluginAPI, defined at
// node_modules/@figma/plugin-typings/index.d.ts
// node_modules/@figma/plugin-typings/plugin-api.d.ts

// Another option here is to dump the full tree of what we need and create factories on top of it.

// It also functions as a way to see which parts of the API we use.

// Protocol naming is borrowed from swift.

// This will also give us a type error if figma introduces a new type that we aren't handling.
// Adds a new type to discriminated union

// Dependency isolation.

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

export interface PaintStyleProtocol {
   name: string
   paints: ReadonlyArray<PaintProtocol>
}

// Helper so I can DI a `figma` double for tests.

// `core` is the seam between the figma plugin and the core of the library. We expect consumers to pass in the figma global and let the lib do the rest.
// At some point, `core` should be plucked out of the 'figma_plugin' tree, and should live outside it.
// Dependency isolation on figma.
// We take the bits that we need to generate colors and match the API.
// The idea is everything under 'core' should be packageable as a library.
// A consumer of the library would have to pass us the `figma` global.
export interface PluginAPIProtocol {
  getLocalPaintStyles(): PaintStyle[]
}

