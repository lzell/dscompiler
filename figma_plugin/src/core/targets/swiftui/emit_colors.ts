import { Color } from 'src/core/models/color.ts'

// Given a color model, return an equivalent SwiftUI color definition.
export function emitColor(color: Color): string {
  return `public static let ${color.name} = Color(red: ${color.red}, green: ${color.green}, blue: ${color.blue}, opacity: ${color.opacity})`
}

// Given a list of colors, return an equivalent SwiftUI file defining all colors.
export function emitColors(colors: ReadonlyArray<Color>): string {
  let swift_content = `import SwiftUI

public extension Color {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's Color.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system colors.
    /// At any call site that requires a color, type \`Color.DesignSystem.<esc>\`
    struct DesignSystem {
`
  for (const color of colors) {
    swift_content += `        ${emitColor(color)}\n`
  }

  swift_content += "    }\n}\n"
  return swift_content
}
