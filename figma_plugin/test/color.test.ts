import { Color } from '../src/core/models/color.ts'
import { inferColors } from '../src/core/origins/figma/infer_colors.ts'
import { emitColor } from '../src/core/targets/swiftui/emit_colors.ts'
import { emitColors } from '../src/core/targets/swiftui/emit_colors.ts'
import { paintStyleToColor } from '../src/core/origins/figma/infer_colors.ts'
import { GradientPaintProtocol } from '../src/core/origins/figma/api_bridge.ts'
import { ImagePaintProtocol } from '../src/core/origins/figma/api_bridge.ts'
import { SolidPaintProtocol } from '../src/core/origins/figma/api_bridge.ts'
import { VideoPaintProtocol } from '../src/core/origins/figma/api_bridge.ts'

test("Infering colors from Figma uses the plugin API call getLocalPaintStyles", () => {
  const getLocalPaintStyles = jest.fn(() => { return Array<PaintStyle>() })
  const figma = { getLocalPaintStyles: getLocalPaintStyles }
  inferColors(figma)
  expect(getLocalPaintStyles).toHaveBeenCalled()
})


test("Paint colors that are not solid are ignored", () => {
  const gradientPaint: GradientPaintProtocol = {type: 'GRADIENT_LINEAR'}
  const imagePaint: ImagePaintProtocol = {type: 'IMAGE'}
  const videoPaint: VideoPaintProtocol = {type: 'VIDEO'}
  expect(paintStyleToColor({name: 'dummy', paints: [gradientPaint, imagePaint, videoPaint]})).toBe(null)
})

test("A solid paint converts to a color model", () => {
  const paint: SolidPaintProtocol = {type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.5}
  expect(paintStyleToColor({name: 'dummy', paints: [paint]})).toStrictEqual({
    name: 'dummy',
    red: 1,
    green: 1,
    blue: 1,
    opacity: 0.5,
  })
})

test("A solid paint without opacity defaults to opacity of 1", () => {
  const paint: SolidPaintProtocol = {type: 'SOLID', color: {r: 0, g: 0, b: 0}}
  expect(paintStyleToColor({name: 'dummy', paints: [paint]})).toStrictEqual({
    name: 'dummy',
    red: 0,
    green: 0,
    blue: 0,
    opacity: 1,
  })
})

test("Only the first solid paint is considered when converting to a color model", () => {
  const paintA: SolidPaintProtocol = {type: 'SOLID', color: {r: 1, g: 0, b: 0}}
  const paintB: SolidPaintProtocol = {type: 'SOLID', color: {r: 1, g: 1, b: 1}}
  expect(paintStyleToColor({name: 'dummy', paints: [paintA, paintB]})).toStrictEqual({
    name: 'dummy',
    red: 1,
    green: 0,
    blue: 0,
    opacity: 1,
  })
})

test("A color name with spaces in figma is converted to camelcase for the color model", () => {
  const paint: SolidPaintProtocol = {type: 'SOLID', color: {r: 0, g: 0, b: 0}}
  const color = paintStyleToColor({name: 'my color', paints: [paint]})
  expect(color?.name).toBe('myColor')
})

test("A color model has a swiftUI equivalent", () => {
  const color: Color = { red: 0, green: 1, blue: 0, opacity: 1, name: 'myColor'}
  expect(emitColor(color)).toBe("public static let myColor = Color(red: 0, green: 1, blue: 0, opacity: 1)")
})

test("Multiple color models have a swiftUI file equivalent", () => {
  const colorA: Color = { red: 0.5, green: 0.5, blue: 0.5, opacity: 0.5, name: 'primaryColor'}
  const colorB: Color = { red: 1, green: 1, blue: 1, opacity: 1, name: 'secondaryColor'}
  expect(emitColors([colorA, colorB])).toBe(`import SwiftUI

public extension Color {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's Color.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system colors.
    /// At any call site that requires a color, type \`Color.DesignSystem.<esc>\`
    struct DesignSystem {
        public static let primaryColor = Color(red: 0.5, green: 0.5, blue: 0.5, opacity: 0.5)
        public static let secondaryColor = Color(red: 1, green: 1, blue: 1, opacity: 1)
    }
}
`)
})
