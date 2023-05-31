// Aids in testing. Can create test doubles that function like figma's
// PluginAPI This should be a strict subset of PluginAPI, defined at
// node_modules/@figma/plugin-typings/index.d.ts
// node_modules/@figma/plugin-typings/plugin-api.d.ts

// Another option here is to dump the full tree of what we need and create factories on top of it.

// It also functions as a way to see which parts of the API we use.

export interface PaintProvider {
   type: string // This could be tightened to "SOLID" | "OTHER-OPTION" | etc.
   visible: boolean
   opacity: number
   blendMode: string // This could be tightened to "NORMAL" | "OTHER-OPTION" | etc.
   color: FakeColor
}

export interface PaintStyleProvider {
   id: string
   paints: ReadonlyArray<PaintProvider>
}

export interface PluginAPIProvider {
  getLocalPaintStyles(): PaintStyleProvider[]
}
