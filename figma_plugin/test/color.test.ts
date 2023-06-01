import { getColors } from '../src/color.ts'
import { PluginAPIProtocol } from '../src/plugin_api_protocol.ts'
import { makePaint, makePaintStyle } from './factory.ts'
//
//
// // Could use JSON.parse to create the fakes from dumped objects.
// //
// // Create a mock response from `figma.getLocalPaintStyles()`
// // console.log(JSON.stringify(figma.getLocalPaintStyles()))
// //[{"id":"S:bd3508cf0a08956792c52e7e90a552f6639d0fdc,"}]
//
// // console.log(JSON.stringify(figma.getLocalPaintStyles()[0].paints))
// //[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.5,"b":0}}]
//
// // console.log(JSON.stringify(figma.getLocalPaintStyles()[0].name))
// // "Primary"
//
// // Build up a test fake and then
//
// type FakeColor = {
//   r: number
//   g: number
//   b: number
// }
//
// type FakePaint = {
//   type: string // This could be tightened to "SOLID" | "OTHER-OPTION" | etc.
//   visible: boolean
//   opacity: number
//   blendMode: string // This could be tightened to "NORMAL" | "OTHER-OPTION" | etc.
//   color: FakeColor
// }
//
// // Why not use the real types for these and get rid of all these doubles?
// // Yeah. Just use the datatypes, if I can figure out how to construct them.
// type FakePaintStyle = {
//   id: string
//   paints: FakePaint[]
// }
//
// // Maybe this needs to be a class that extends FigmaProtocol, and call the constructor. Seems I can't create a type that conforms to an interface.
//
// const x2: SolidPaint[] = [{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.5,"b":0}}]
//

// I could make this an object just as easily with `fakeFigma: PluginAPIProtocol = { ... define object }`
class FakeFigma implements PluginAPIProtocol {

  getLocalPaintStyles(): PaintStyle[] {
    return [makePaintStyle()]
  }
}
//
// let figma: FakeFigma = new FakeFigma()
// // That worked. I don't know if I could get away with it with less boilerplate.
//
// // let paints: FakePaint[] =  [{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.5,"b":0}}]
// // let paintStyles: FakePaintStyle[] = [{"id": "123", "paints": paints}]
//
// // type X = { thing: (a: number) => string }
// // function brah(a: number): string {
// //   console.log(a)
// //   return "hi"
// // }
// // let z: X = {thing: brah}
//
//
test('getColors binds to getLocalPaintStyles', async () => {
  const figma = new FakeFigma()
  const foo = await getColors(figma)
  expect(foo[0].red).toBe(1)
  // Use a mock here. For the original test.
})

// Document how to create multiple paint styles as a localStyle.
// test('all paint styles other than the first are ignored')

//
//
//
// //test('placeholder test', () => {
// //  // How do I want to write this?
// //  // Pass mock
// //  // Assert `getLocalPaintStyles` is called
// //  getColors(mockFigma)
// //  expect(getPlaceholder()).toBe(123)
// //})
//
// // Test double
//
//
// // I could pass in a mock and make sure it's called in the way I expect.
// // That's pretty white box.
// // How about just DI a test double?
