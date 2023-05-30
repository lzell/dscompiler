import { getColors } from '../src/color.ts'


// Could use JSON.parse to create the fakes from dumped objects.
//
// Create a mock response from `figma.getLocalPaintStyles()`
// console.log(JSON.stringify(figma.getLocalPaintStyles()))
//[{"id":"S:bd3508cf0a08956792c52e7e90a552f6639d0fdc,"}]

// console.log(JSON.stringify(figma.getLocalPaintStyles()[0].paints))
//[{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.5,"b":0}}]

// console.log(JSON.stringify(figma.getLocalPaintStyles()[0].name))
// "Primary"

// Build up a test fake and then

type FakeColor = {
  r: number
  g: number
  b: number
}

type FakePaint = {
  type: string // This could be tightened to "SOLID" | "OTHER-OPTION" | etc.
  visible: boolean
  opacity: number
  blendMode: string // This could be tightened to "NORMAL" | "OTHER-OPTION" | etc.
  color: FakeColor
}

type FakePaintStyle = {
  id: string
  paints: FakePaint[]
}

type FakeFigma = { getLocalPaintStyles: () => FakePaintStyle[] }
function fakeGetLocalPaintStyles(): FakePaintStyle[] {
  return [{"id": "123", "paints": [{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.5,"b":0}}]}]
}

let figma: FakeFigma = { getLocalPaintStyles: fakeGetLocalPaintStyles }
// That worked. I don't know if I could get away with it with less boilerplate.

// let paints: FakePaint[] =  [{"type":"SOLID","visible":true,"opacity":1,"blendMode":"NORMAL","color":{"r":1,"g":0.5,"b":0}}]
// let paintStyles: FakePaintStyle[] = [{"id": "123", "paints": paints}]

// type X = { thing: (a: number) => string }
// function brah(a: number): string {
//   console.log(a)
//   return "hi"
// }
// let z: X = {thing: brah}


test('getColors binds to getLocalPaintStyles', async () => {
  const foo = await getColors(figma)
  expect(foo[0].red).toBe(1)
  // Use a mock here.
})


//test('placeholder test', () => {
//  // How do I want to write this?
//  // Pass mock
//  // Assert `getLocalPaintStyles` is called
//  getColors(mockFigma)
//  expect(getPlaceholder()).toBe(123)
//})

// Test double


// I could pass in a mock and make sure it's called in the way I expect.
// That's pretty white box.
// How about just DI a test double?
