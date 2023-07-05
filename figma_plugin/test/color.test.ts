// API bridge types
import { IImagePaint } from '../src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from '../src/core/origins/figma/api_bridge.ts'
import { ISolidPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IVideoPaint } from '../src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { NamedColor } from '../src/core/models/color.ts'
import { emitColor } from '../src/core/targets/swiftui/emit_colors.ts'
import { emitColors } from '../src/core/targets/swiftui/emit_colors.ts'
import { inferColors } from '../src/core/origins/figma/infer_colors.ts'
import { paintStyleToColor } from '../src/core/origins/figma/infer_colors.ts'

// Specific to testing
import { makePaintStyle } from './factories.ts'
import { makePluginAPI } from './factories.ts'

test("Infering colors from Figma uses the plugin API call getLocalPaintStyles", () => {
  const getLocalPaintStyles = jest.fn(() => { return Array<IPaintStyle>() })
  const figma = makePluginAPI({ getLocalPaintStyles: getLocalPaintStyles })
  inferColors(figma)
  expect(getLocalPaintStyles).toHaveBeenCalled()
})

test("Image paints and video paints are ignored", () => {
  const imagePaint: IImagePaint = {type: 'IMAGE'}
  const videoPaint: IVideoPaint = {type: 'VIDEO'}

  const paintStyle = makePaintStyle({paints: [imagePaint, videoPaint]})
  const getLocalPaintStyles = jest.fn(() => { return [paintStyle] })
  const figma = makePluginAPI({ getLocalPaintStyles: getLocalPaintStyles })
  expect(inferColors(figma)).toEqual([])
})

test("A paint style with solid paint converts to a color model", () => {
  const paint: ISolidPaint = {type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.5}
  const color = paintStyleToColor(makePaintStyle({paints: [paint]}))
  expect(color).toMatchObject({
    red: 1,
    green: 1,
    blue: 1,
    opacity: 0.5,
  })
})

test("A solid paint without opacity defaults to a color model with opacity 1", () => {
  const paint: ISolidPaint = {type: 'SOLID', color: {r: 0, g: 0, b: 0}}
  const color = paintStyleToColor(makePaintStyle({paints: [paint]}))
  expect(color.opacity).toBe(1)
})

test("Only the first solid paint is considered when converting to a color model", () => {
  const paintA: ISolidPaint = {type: 'SOLID', color: {r: 1, g: 0, b: 0}}
  const paintB: ISolidPaint = {type: 'SOLID', color: {r: 1, g: 1, b: 1}}
  const color = paintStyleToColor(makePaintStyle({paints: [paintA, paintB]}))
  expect(color).toMatchObject({
    red: 1,
    green: 0,
    blue: 0,
  })
})

test("A paint style name with spaces in figma is converted to camelcase for the color model", () => {
  const color = paintStyleToColor(makePaintStyle({name: 'primary color'}))
  expect(color.name).toBe('primaryColor')
})

test("A paint style description is passed through to color model", () => {
  const color = paintStyleToColor(makePaintStyle({description: 'this is a description'}))
  expect(color.description).toBe('this is a description')
})

test("A named color model has a swiftUI equivalent", () => {
  const color: NamedColor = { red: 0, green: 1, blue: 0, opacity: 1, name: 'myColor', description: 'My Docstring'}
  expect(emitColor(color)).toBe(
`/// My Docstring
public static let myColor = Color(red: 0, green: 1, blue: 0, opacity: 1)`)
})

test("Multiple color models have a swiftUI file equivalent", () => {
  const colorA: NamedColor = { red: 0.5, green: 0.5, blue: 0.5, opacity: 0.5, name: 'primaryColor', description: 'Docstring A'}
  const colorB: NamedColor = { red: 1, green: 1, blue: 1, opacity: 1, name: 'secondaryColor', description: 'Docstring B'}
  expect(emitColors([colorA, colorB])).toBe(
`import SwiftUI

public extension Color {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's Color.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system colors.
    /// At any call site that requires a color, type \`Color.DesignSystem.<ctrl-space>\`
    struct DesignSystem {
        /// Docstring A
        public static let primaryColor = Color(red: 0.5, green: 0.5, blue: 0.5, opacity: 0.5)

        /// Docstring B
        public static let secondaryColor = Color(red: 1, green: 1, blue: 1, opacity: 1)
    }
}
`)
})
