import { upperFirst } from 'lodash'
import { DSEffect } from 'src/core/models/effect.ts'
import { NamedCompositeEffect } from 'src/core/models/effect.ts'

export function emitEffect(effect: DSEffect, indentLevel = 0 ): string {
  const prefix = ' '.repeat(indentLevel)
  const isShadow = "color" in effect
  if (isShadow) {
    return `${prefix}.shadow(color: Color(red:${effect.color.red}, green: ${effect.color.green}, blue: ${effect.color.blue}, opacity: ${effect.color.opacity ?? 1}), radius: ${effect.radius}, x: ${effect.offset.x}, y:${effect.offset.y})\n`
  } else {
    return `${prefix}.blur(radius: ${effect.radius})\n`
  }
}

// Given a composite effect model, return an equivalent SwiftUI modifier definition.
export function emitCompositeEffect(compositeEffect: NamedCompositeEffect, indentLevel = 0): string {
  const prefix = ' '.repeat(indentLevel)
  let swift_content = `${prefix}/// ${compositeEffect.description}\n`
  swift_content += `${prefix}public struct ${upperFirst(compositeEffect.name)}: ViewModifier {\n`
  swift_content += `${prefix}    public func body(content: Content) -> some View {\n`
  swift_content += `${prefix}        return content\n`
  for (const effect of compositeEffect.effects) {
    swift_content += emitEffect(effect, indentLevel + 12)
  }
  swift_content += `${prefix}    }\n`
  swift_content += `${prefix}    public init() {}\n`
  swift_content += `${prefix}}\n`
  return swift_content
}

export function emitCompositeEffects(compositeEffects: ReadonlyArray<NamedCompositeEffect>): string {

    let swift_content = `import SwiftUI

public struct Effect {
    /// Xcode's autocomplete allows for easy discovery of design system effects.
    /// At any call site that requires an effect, type \`Effect.DesignSystem.<ctrl-space>\`
    public struct DesignSystem {

`
    for (const compositeEffect of compositeEffects) {
      swift_content += emitCompositeEffect(compositeEffect, 8) + "\n"
    }
    swift_content = swift_content.slice(0, -1)

    swift_content += "    }\n}\n\n"
    swift_content += "public extension View {\n"

    for (const compositeEffect of compositeEffects) {
      swift_content += `    func ${compositeEffect.name}() -> some View {modifier(Effect.DesignSystem.${upperFirst(compositeEffect.name)}())}\n`
    }

    swift_content += "}\n"
    return swift_content
}
