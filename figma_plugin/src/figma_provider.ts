// Can I inline these?
// interface GetColorsFunc {
//   (): any[];
// }

// How do I import the figma types, like return of getLocalPaintStyles
export interface FigmaProvider {
  getLocalPaintStyles: () => PaintStyle[]
}
