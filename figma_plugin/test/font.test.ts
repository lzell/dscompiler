// API bridge types
import { ITextStyle } from '../src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { CustomFont } from '../src/core/models/font.ts'
import { SystemFont } from '../src/core/models/font.ts'
import { emitFont } from '../src/core/targets/swiftui/emit_fonts.ts'
import { emitFonts } from '../src/core/targets/swiftui/emit_fonts.ts'
import { inferFonts } from '../src/core/origins/figma/infer_fonts.ts'
import { textStyleToFont } from '../src/core/origins/figma/infer_fonts.ts'
import { logToUser } from '../src/core/utils/log.ts'

// Specific to testing
import { makePluginAPI } from './factories.ts'
import { makeTextStyle } from './factories.ts'

// Don't actually log to the user.
// Instead, inspect a mock and ensure the right message is being sent.
jest.mock('../src/core/utils/log.ts', () => {
  return { logToUser: jest.fn() }
})
afterEach(() => { jest.restoreAllMocks() })

test("Infering fonts from Figma uses the plugin API call getLocalTextStyles", () => {
  const getLocalTextStyles = jest.fn(() => { return Array<ITextStyle>() })
  const figma = makePluginAPI({ getLocalTextStyles: getLocalTextStyles })
  inferFonts(figma)
  expect(getLocalTextStyles).toHaveBeenCalled()
})

test("A text style that uses a New York font converts to a SystemFont with serif design", () => {
  const textStyle = makeTextStyle({fontName: {family: 'New York', style: 'Regular'}})
  const font = textStyleToFont(textStyle) as SystemFont
  expect(font.design).toBe(".serif")
  expect(font.weight).toBe(".regular")
})

test("A text style that uses an SF rounded font converts to a SystemFont with rounded design", () => {
  const textStyle = makeTextStyle({fontName: {family: 'SF Pro Rounded', style: 'Regular'}})
  const font = textStyleToFont(textStyle) as SystemFont
  expect(font.design).toBe(".rounded")
})

test("A text style that uses an SF monospace font converts to a SystemFont with monospaced design", () => {
  const textStyle = makeTextStyle({fontName: {family: 'SF Mono', style: 'Regular'}})
  const font = textStyleToFont(textStyle) as SystemFont
  expect(font.design).toBe(".monospaced")
})

test("A text style that uses a SF Pro converts to a SystemFont with default design", () => {
  const textStyle = makeTextStyle({fontName: {family: 'SF Pro', style: 'Regular'}})
  const font = textStyleToFont(textStyle) as SystemFont
  expect(font.design).toBe(".default")
})

test("A text style's font style is camelcased on conversion to a Font model", () => {
  const textStyle = makeTextStyle({fontName: {family: 'SF Pro', style: 'Condensed Bold'}})
  const font = textStyleToFont(textStyle) as SystemFont
  expect(font.weight).toBe(".condensedBold")
})

test("The family and text style of non-built-in fonts are concatenated to form the custom font name", () => {
  const textStyle = makeTextStyle({fontName: {family: 'My Font', style: 'Condensed Bold'}})
  const font = textStyleToFont(textStyle) as CustomFont
  expect(font.fontName).toBe("MyFont-CondensedBold")
})

test("Fonts that don't follow an expected Family-Style pattern are supported via our explicit font mapping", () => {
  const textStyle = makeTextStyle({fontName: {family: 'Arial Rounded MT Bold', style: 'Regular'}})
  const font = textStyleToFont(textStyle) as CustomFont
  expect(font.fontName).toBe("ArialRoundedMTBold")
})

test("Named system fonts are inferred from text styles", () => {
  const textStyle = {
    name: 'my font',
    description: 'my description',
    fontName: {family: 'SF Pro', style: 'Regular'},
    fontSize: 12
  }
  const getLocalTextStyles = () => [textStyle]
  const figma = makePluginAPI({ getLocalTextStyles: getLocalTextStyles })
  const fonts = inferFonts(figma)
  expect(fonts.length).toBe(1)
  expect(fonts[0]).toMatchObject({
    atomName: 'myFont',
    description: 'my description',
    size: 12,
    design: '.default',
    weight: '.regular',
  })
})

test("Named custom fonts are inferred from text styles", () => {
  const textStyle = {
    name: 'my font',
    description: 'my description',
    fontName: {family: 'American Typewriter', style: 'Condensed Bold'},
    fontSize: 12
  }
  const getLocalTextStyles = () => [textStyle]
  const figma = makePluginAPI({ getLocalTextStyles: getLocalTextStyles })
  const fonts = inferFonts(figma)
  expect(fonts.length).toBe(1)
  expect(fonts[0]).toMatchObject({
    atomName: 'myFont',
    description: 'my description',
    size: 12,
    fontName: 'AmericanTypewriter-CondensedBold',
  })
})

test("The user is alerted when trying to map a font that is not built into iOS", () => {
  const textStyle = makeTextStyle({fontName: {family: 'MyCustomFont', style: 'Regular'}})
  const getLocalTextStyles = () => [textStyle]
  const figma = makePluginAPI({ getLocalTextStyles: getLocalTextStyles })
  inferFonts(figma)
  expect(logToUser).toBeCalledWith('The font MyCustomFont Regular is not an iOS built-in. For your font to work correctly, follow the steps here: https://www.threads.net/@swiftuitoday/post/Cujx_LEOS4e')
})

test("A system font model has a SwiftUI equivalent", () => {
  const systemFont: SystemFont = {
    atomName: 'myFont',
    description: 'my font',
    size: 12,
    weight: '.regular',
    design: '.rounded'
  }
  const swiftUI = emitFont(systemFont)
  expect(swiftUI).toBe(
    '/// my font\n' +
    'public static let myFont = Font.system(size: 12, weight: .regular, design: .rounded)\n'
  )
})

test("A custom font model has a SwiftUI equivalent", () => {
  const customFont: CustomFont = {
    atomName: 'myFont',
    description: 'my font',
    size: 12,
    fontName: 'AmericanTypewriter-CondensedBold',
  }
  const swiftUI = emitFont(customFont)
  expect(swiftUI).toBe(
    '/// my font\n' +
    'public static let myFont = Font.custom("AmericanTypewriter-CondensedBold", size: 12)\n'
  )
})

test("A list of fonts has a SwiftUI equivalent file", () => {
  const systemFont: SystemFont = {
    atomName: 'firstFont',
    description: 'my first font',
    size: 12,
    weight: '.regular',
    design: '.rounded'
  }
  const customFont: CustomFont = {
    atomName: 'secondFont',
    description: 'my second font',
    size: 12,
    fontName: 'AmericanTypewriter-CondensedBold',
  }
  const swiftUI = emitFonts([systemFont, customFont])
  expect(swiftUI).toBe(`import SwiftUI

public extension Font {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's Font.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system fonts.
    /// At any call site that requires a font, type \`Font.DesignSystem.<ctrl-space>\`
    struct DesignSystem {
        /// my first font
        public static let firstFont = Font.system(size: 12, weight: .regular, design: .rounded)

        /// my second font
        public static let secondFont = Font.custom("AmericanTypewriter-CondensedBold", size: 12)
    }
}
`)
})

