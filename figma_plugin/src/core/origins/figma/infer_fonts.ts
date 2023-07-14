import { camelCase } from 'lodash'
import { replace } from 'lodash'

// API bridge types
import { IFontName } from 'src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'
import { ITextStyle } from 'src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { APPLE_FONTS } from 'src/core/utils/apple_fonts.ts'
import { Font, SystemFont, CustomFont } from 'src/core/models/font.ts'
import { logToUser } from 'src/core/utils/log.ts'
import { sanitizeName } from 'src/core/utils/common.ts'

export function inferFonts(figma: IPluginAPI): ReadonlyArray<Font> {
  return figma.getLocalTextStyles().sort((x,y) => y.fontSize - x.fontSize)
                                   .map(textStyleToFont)
}

export function textStyleToFont(textStyle: ITextStyle): CustomFont | SystemFont {
  const atomName = sanitizeName(textStyle.name)
  const isSystem = /^(sf|new york)/i
  const font: Font = { atomName: atomName, description: textStyle.description, size: textStyle.fontSize }
  if (isSystem.test(textStyle.fontName.family)) {
    return {
      ...font,
      weight: systemFontWeight(textStyle),
      design: systemFontDesign(textStyle)
    }
  }
  return {
    ...font,
    fontName: postScriptFontName(textStyle.fontName)
  }
}

function systemFontWeight(textStyle: ITextStyle): string {
  return '.' + camelCase(stripWhitespace(textStyle.fontName.style))
}

function systemFontDesign(textStyle: ITextStyle): string {
    const isRounded = /rounded/i
    const isMono = /mono/i
    const isSerif = /new york/i
    if (isRounded.test(textStyle.fontName.family)) {
      return '.rounded'
    } else if (isMono.test(textStyle.fontName.family)) {
      return '.monospaced'
    } else if (isSerif.test(textStyle.fontName.family)) {
      return '.serif'
    } else {
      return '.default'
    }
}

function stripWhitespace(str: string): string {
  return replace(str, /\s/g, '')
}

// Use the Mac application FontBook to view the PostScript name of
// any font (tap the 'i' icon after selecting the font)
function postScriptFontName(fontName: IFontName): string {
  const fullFontName = fontName.family + ' ' +  fontName.style
  const appleFont = APPLE_FONTS.get(fullFontName)
  if (appleFont) {
    return appleFont[1]
  }

  // We don't explicitly know about this font. Fall back to a best guess and message the user
  // that this font is not built into iOS.
  logToUser(`The font ${fullFontName} is not an iOS built-in. For your font to work correctly, follow the steps here: https://www.threads.net/@swiftuitoday/post/Cujx_LEOS4e`)
  return stripWhitespace(fontName.family) + '-' + stripWhitespace(fontName.style)
}
