import { Color } from 'src/core/models/color.ts'

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
  for (let color of colors) {
    swift_content += `        public static let ${color.name} = Color(red: ${color.red}, green: ${color.green}, blue: ${color.blue}, opacity: ${color.opacity})\n`
  }

  swift_content += "    }\n}\n"
  return swift_content
}

//export function generateColorsFile(colors: Color[]): string {
//}
//
