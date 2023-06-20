import { NamedGradient } from 'src/core/models/gradient.ts'

// Given a gradient model, return an equivalent SwiftUI gradient definition.
export function emitGradient(gradient: NamedGradient, indentLevel = 0): string {
  const prefix = ' '.repeat(indentLevel)
  let swift_content = `${prefix}/// ${gradient.description}\n`
  swift_content += `${prefix}public static let ${gradient.name} = LinearGradient(\n`
  swift_content += `${prefix}    stops: [\n`
  gradient.stops.forEach(stop => {
    swift_content += `${prefix}        Gradient.Stop(color: Color(red: ${stop.color.red}, green: ${stop.color.green}, blue: ${stop.color.blue}, opacity: ${stop.color.opacity ?? 1}), location: ${stop.location}),\n`
  })
  swift_content += `${prefix}    ],\n`
  swift_content += `${prefix}    startPoint: UnitPoint(x: ${gradient.startPoint.x}, y: ${gradient.startPoint.y}),\n`
  swift_content += `${prefix}    endPoint: UnitPoint(x: ${gradient.endPoint.x}, y: ${gradient.endPoint.y})\n`
  swift_content += `${prefix})`
  return swift_content
}

// Given a list of gradients, return an equivalent SwiftUI file defining all gradients.
export function emitGradients(gradients: ReadonlyArray<NamedGradient>): string {
  let swift_content = `import SwiftUI

public extension LinearGradient {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's LinearGradient.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system linear gradients.
    /// At any call site that requires a linear gradient, type \`LinearGradient.DesignSystem.<esc>\`
    struct DesignSystem {
`
  const indentLevel = 8
  for (const gradient of gradients) {
    swift_content += `${emitGradient(gradient, indentLevel)}\n\n`
  }
  swift_content = swift_content.slice(0, -1)

  swift_content += "    }\n}\n"
  return swift_content
}
