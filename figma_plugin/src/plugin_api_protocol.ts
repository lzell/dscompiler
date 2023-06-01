// Aids in testing. Can create test doubles that function like figma's
// PluginAPI This should be a strict subset of PluginAPI, defined at
// node_modules/@figma/plugin-typings/index.d.ts
// node_modules/@figma/plugin-typings/plugin-api.d.ts

// Another option here is to dump the full tree of what we need and create factories on top of it.

// It also functions as a way to see which parts of the API we use.

// Protocol naming is borrowed from swift.

// This will also give us a type error if figma introduces a new type that we aren't handling.
// Adds a new type to discriminated union

//export interface RGBProtocol {
//  readonly r: number
//  readonly g: number
//  readonly b: number
//}
//
//export interface SolidPaintProtocol {
//  readonly color: RGBProtocol
//  readonly opacity?: number
//}
//
//declare type PaintProtocol = SolidPaintProtocol
//
//export interface PaintStyleProtocol {
//   paints: ReadonlyArray<PaintProtocol>
//}
//

// Helper so I can DI a `figma` double for tests.
export interface PluginAPIProtocol {
  getLocalPaintStyles(): PaintStyle[]
}


