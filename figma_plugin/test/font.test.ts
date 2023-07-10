// API bridge types
import { ITextStyle } from '../src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { inferFonts } from '../src/core/origins/figma/infer_fonts.ts'

// Specific to testing
import { makePluginAPI } from './factories.ts'

test("Infering fonts from Figma uses the plugin API call getLocalTextStyles", () => {
  const getLocalTextStyles = jest.fn(() => { return Array<ITextStyle>() })
  const figma = makePluginAPI({ getLocalTextStyles: getLocalTextStyles })
  inferFonts(figma)
  expect(getLocalTextStyles).toHaveBeenCalled()
})
