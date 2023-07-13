export interface Font {
  readonly atomName: string
  readonly description: string
  readonly size: number
}

export interface SystemFont extends Font {
  readonly weight: string
  readonly design: string
}

export interface CustomFont extends Font {
  readonly fontName: string
}
