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



export type ILZELLNode = IInstanceNode | IComponentNode

interface IExportSettingsPDF {
  readonly format: 'PDF'
}

declare type IExportSettings = IExportSettingsPDF

export interface IPageNode {
  readonly children: ReadonlyArray<ISceneNode>
}


export declare interface ISliceNode { readonly type: 'SLICE' }
export interface IFrameNode {
  readonly type: 'FRAME'
  name: string
}
export declare interface IGroupNode { readonly type: 'GROUP' }
export declare interface IComponentSetNode { readonly type: 'COMPONENT_SET' }
export interface IComponentNode {
  readonly type: 'COMPONENT'
  name: string
  exportAsync(settings?: IExportSettings): Promise<Uint8Array>
}
export interface IInstanceNode {
  readonly type: 'INSTANCE'
  name: string
  exportAsync(settings?: IExportSettings): Promise<Uint8Array>
}


export declare interface IBooleanOperationNode { readonly type: 'BOOLEAN_OPERATION' }
export declare interface IVectorNode { readonly type: 'VECTOR' }
export declare interface IStarNode { readonly type: 'STAR' }
export declare interface ILineNode { readonly type: 'LINE' }
export declare interface IEllipseNode { readonly type: 'ELLIPSE' }
export declare interface IPolygonNode { readonly type: 'POLYGON' }
export declare interface IRectangleNode { readonly type: 'RECTANGLE' }
export declare interface ITextNode { readonly type: 'TEXT' }
export declare interface IStickyNode { readonly type: 'STICKY' }
export declare interface IConnectorNode { readonly type: 'CONNECTOR' }
export declare interface IShapeWithTextNode { readonly type: 'SHAPE_WITH_TEXT' }
export declare interface ICodeBlockNode { readonly type: 'CODE_BLOCK' }
export declare interface IStampNode { readonly type: 'STAMP' }
export declare interface IWidgetNode { readonly type: 'WIDGET' }
export declare interface IEmbedNode { readonly type: 'EMBED' }
export declare interface ILinkUnfurlNode { readonly type: 'LINK_UNFURL' }
export declare interface IMediaNode { readonly type: 'MEDIA' }
export declare interface ISectionNode { readonly type: 'SECTION' }
export declare interface IHighlightNode { readonly type: 'HIGHLIGHT' }
export declare interface IWashiTapeNode { readonly type: 'WASHI_TAPE' }
export declare interface ITableNode { readonly type: 'TABLE' }



export declare type ISceneNode =
  | ISliceNode
  | IFrameNode
  | IGroupNode
  | IComponentSetNode
  | IComponentNode
  | IInstanceNode
  | IBooleanOperationNode
  | IVectorNode
  | IStarNode
  | ILineNode
  | IEllipseNode
  | IPolygonNode
  | IRectangleNode
  | ITextNode
  | IStickyNode
  | IConnectorNode
  | IShapeWithTextNode
  | ICodeBlockNode
  | IStampNode
  | IWidgetNode
  | IEmbedNode
  | ILinkUnfurlNode
  | IMediaNode
  | ISectionNode
  | IHighlightNode
  | IWashiTapeNode
  | ITableNode
