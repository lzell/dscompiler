// This file defines a strict subset of Figma's Plugin API.
// Browse the full plugin API at:
//
//   node_modules/@figma/plugin-typings/index.d.ts
//   node_modules/@figma/plugin-typings/plugin-api.d.ts
//
// We duplicate parts of the API definition to:
//   1. Isolate dependencies. Source code under `src/core` can run outside of Figma's plugin environment (e.g. in tests).
//   2. Serve as a reference to quickly see which parts of the plugin API we use.
//   3. Serve as a static check to ensure the figma API doesn't change out from under us.
//      If this were to happen, typechecking `/test` would work fine, but typechecking `/src` would fail.
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
  getLocalEffectStyles(): IEffectStyle[]
  getLocalTextStyles(): ITextStyle[]
  currentPage: IPageNode
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

export interface IEffectStyle {
  name: string
  description: string
  effects: ReadonlyArray<IEffect>
}

export declare type IEffect = IDropShadowEffect | IInnerShadowEffect | IBlurEffect

export interface IDropShadowEffect {
  readonly type: 'DROP_SHADOW'
  readonly color: IRGBA
  readonly offset: {x: number, y: number}
  readonly radius: number
  readonly spread?: number
}

export interface IInnerShadowEffect {
  readonly type: 'INNER_SHADOW'
}

export interface IBlurEffect {
  readonly type: 'LAYER_BLUR' | 'BACKGROUND_BLUR'
  readonly radius: number
}

export interface ITextStyle {
  name: string
  description: string
  fontSize: number
  fontName: IFontName
}

export interface IFontName {
  readonly family: string
  readonly style: string
}

export interface IFrameNode {
  readonly type: 'FRAME'
  name: string
}

export declare type ISceneNode = IFrameNode | IComponentNode | IInstanceNode

export interface IInstanceNode {
  readonly type: 'INSTANCE'
  name: string
  exportAsync(settings?: IExportSettings): Promise<Uint8Array>
}

export interface IComponentNode {
  readonly type: 'COMPONENT'
  name: string
  exportAsync(settings?: IExportSettings): Promise<Uint8Array>
}

export type ILZELLNode = IInstanceNode | IComponentNode

interface IExportSettingsPDF {
  readonly format: 'PDF'
}

declare type IExportSettings = IExportSettingsPDF

export interface IPageNode {
  readonly children: ReadonlyArray<ISceneNode>
}
