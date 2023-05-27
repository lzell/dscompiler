import { getPlaceholder } from '../src/color.ts'


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

type FakePaint = {

}

type FakePaintStyle = {
  id: string
  paints: ARRAY_OF_PAINTS
}


type X = { thing: (a: number) => string }
function brah(a: number): string {
  console.log(a)
  return "hi"
}
let z: X = {thing: brah}

type FakeFigma {
  getLocalPaintStyles: () => ARRAY_OF_PAINT_STYLES
}

test('getColors binds to getLocalPaintStyles', () => {
  // Use a mock here.
})

test('

test('placeholder test', () => {
  // How do I want to write this?
  // Pass mock
  // Assert `getLocalPaintStyles` is called
  getColors(mockFigma)
  expect(getPlaceholder()).toBe(123)
})

// Test double


// I could pass in a mock and make sure it's called in the way I expect.
// That's pretty white box.
// How about just DI a test double?
