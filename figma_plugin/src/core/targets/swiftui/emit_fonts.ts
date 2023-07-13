import { CustomFont } from 'src/core/models/font.ts'
import { Font } from 'src/core/models/font.ts'
import { SystemFont } from 'src/core/models/font.ts'
import { escapeSwiftToken } from 'src/core/utils/common.ts'

// Given a font model, return an equivalent SwiftUI font definition.
export function emitFont(font: Font, indentLevel=0): string {
  const prefix = ' '.repeat(indentLevel)
  return `${prefix}/// ${font.description}\n` +
         `${prefix}public static let ${escapeSwiftToken(font.atomName)} = ${getFontCall(font)}\n`
}

// Given a list of fonts, return an equivalent SwiftUI file defining all fonts.
export function emitFonts(fonts: ReadonlyArray<Font>): string {
  let swift_content = `import SwiftUI

public extension Font {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's Font.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system fonts.
    /// At any call site that requires a font, type \`Font.DesignSystem.<ctrl-space>\`
    struct DesignSystem {
`
  const indentLevel = 8
  for (let font of fonts) {
    swift_content += `${emitFont(font, indentLevel)}\n`
  }
  swift_content = swift_content.slice(0, -1)

  swift_content += "    }\n}\n"
  return swift_content
}

function getFontCall(font: Font): string {
  if (isCustom(font)) {
    return `Font.custom("${font.fontName}", size: ${font.size})`
  } else if (isSystem(font)) {
    return `Font.system(size: ${font.size}, weight: ${font.weight}, design: ${font.design})`
  } else {
    const msg = "Unexpected error, please file a github issue and assign it to lzell"
    console.assert(false, msg)
    return msg
  }
}

function isCustom(font: Font): font is CustomFont {
  return (font as CustomFont).fontName !== undefined
}

function isSystem(font: Font): font is SystemFont {
  return (font as SystemFont).design !== undefined
}

