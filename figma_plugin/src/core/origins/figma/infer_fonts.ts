import { camelCase } from 'lodash'
import { replace } from 'lodash'

// API bridge types
import { IFontName } from 'src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'
import { ITextStyle } from 'src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { Font, SystemFont, CustomFont } from 'src/core/models/font.ts'
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
  return  stripWhitespace(fontName.family) + '-' + stripWhitespace(fontName.style)
}
