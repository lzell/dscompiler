// API bridge types
import { IEffectStyle } from '../src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { Blur } from '../src/core/models/effect.ts'
import { NamedCompositeEffect } from '../src/core/models/effect.ts'
import { Shadow } from '../src/core/models/effect.ts'
import { effectToDSEffect } from '../src/core/origins/figma/infer_effects.ts'
import { emitEffect } from '../src/core/targets/swiftui/emit_effects.ts'
import { emitCompositeEffect } from '../src/core/targets/swiftui/emit_effects.ts'
import { emitCompositeEffects } from '../src/core/targets/swiftui/emit_effects.ts'
import { inferEffects } from '../src/core/origins/figma/infer_effects.ts'
import { logToUser } from '../src/core/utils/log.ts'

// Specific to testing
import { makeBackgroundBlurEffect } from './factories.ts'
import { makeDropShadowEffect } from './factories.ts'
import { makeEffectStyle } from './factories.ts'
import { makeInnerShadowEffect } from './factories.ts'
import { makeLayerBlurEffect } from './factories.ts'
import { makePluginAPI } from './factories.ts'

// Don't actually log to the user.
// Instead, inspect a mock and ensure the right message is being sent.
jest.mock('../src/core/utils/log.ts', () => {
  return { logToUser: jest.fn() }
})
afterEach(() => { jest.restoreAllMocks() })

test("Inferring effects from Figma uses the plugin API call getLocalEffectsStyles", () => {
  const getLocalEffectStyles = jest.fn(() => { return Array<IEffectStyle>() })
  const figma = makePluginAPI({ getLocalEffectStyles: getLocalEffectStyles })
  inferEffects(figma)
  expect(getLocalEffectStyles).toHaveBeenCalled()
})

test("A layer blur figma effect is converted into a Blur model", () => {
  const figmaEffect = makeLayerBlurEffect({radius: 1})
  const blurModel = effectToDSEffect(figmaEffect)
  expect(blurModel).toMatchObject({radius: 0.5}) // The radius is corrected by a factor of 1/2 for visual consistency between Figma and SwiftUI
})

test("A drop shadow figma effect is converted into a Shadow model", () => {
  const figmaEffect = makeDropShadowEffect({
    color: {r: 1, g: 0, b: 0, a: 1},
    offset: {x: 9, y: 9},
    radius: 1,
  })
  const shadowModel = effectToDSEffect(figmaEffect)
  expect(shadowModel).toMatchObject({
    color: {red: 1, green: 0, blue: 0, opacity: 1},
    radius: 0.5,
    offset: {x: 9, y: 9},
  })
})

test("An effect style maps to a composite effect model", () => {
  const effectStyle = makeEffectStyle({
      name: "My Style",
      description: "style description",
      effects: [
        makeDropShadowEffect({
          color: {r: 1, g: 0, b: 0, a: 1},
          offset: {x: 1, y: 1},
          radius: 1,
        }),
        makeLayerBlurEffect({
          radius: 2
        })
      ]
  })
  const figma = makePluginAPI({ getLocalEffectStyles: () => { return [effectStyle] } })
  const compositeEffects = inferEffects(figma)
  expect(compositeEffects.length).toBe(1)
  expect(compositeEffects[0]).toMatchObject({
    name: "myStyle",
    description: "style description",
    effects: [
      {
        color: {red: 1, green: 0, blue: 0, opacity: 1},
        offset: {x: 1, y: 1},
        radius: 0.5,
      },
      {
        radius: 1
      }
    ]
  })
})

test("A blur model has corresponding SwiftUI", () => {
  const blur: Blur = {radius: 5}
  const swiftUI = emitEffect(blur)
  expect(swiftUI).toBe(".blur(radius: 5)\n")
})

test("A drop shadow model has corresponding SwiftUI", () => {
  const shadow: Shadow = {
    color: { red: 1, green: 0, blue: 0, opacity: 1},
    radius: 5,
    offset: {x: 1, y: 1},
  }
  const swiftUI = emitEffect(shadow)
  expect(swiftUI).toBe(".shadow(color: Color(red:1, green: 0, blue: 0, opacity: 1), radius: 5, x: 1, y:1)\n")
})

test("A named blur effect has corresponding SwiftUI", () => {
  const namedEffect: NamedCompositeEffect = {
    name: "myBlur",
    description: "Use this blur to...",
    effects: [
      { radius: 2 },
    ]
  }
  const emittedSwiftUI = emitCompositeEffect(namedEffect)
  expect(emittedSwiftUI).toBe(
`/// Use this blur to...
public struct MyBlur: ViewModifier {
    public func body(content: Content) -> some View {
        return content
            .blur(radius: 2)
    }
    public init() {}
}
`)
})

test("A named shadow effect has corresponding SwiftUI", () => {
  const namedEffect: NamedCompositeEffect = {
    name: "myShadow",
    description: "Use this shadow to...",
    effects: [
      {
        color: { red: 1, green: 0, blue: 0, opacity: 1 },
        radius: 2,
        offset: { x: 1, y: 1 },
      },
    ]
  }
  const emittedSwiftUI = emitCompositeEffect(namedEffect)
  expect(emittedSwiftUI).toBe(
`/// Use this shadow to...
public struct MyShadow: ViewModifier {
    public func body(content: Content) -> some View {
        return content
            .shadow(color: Color(red:1, green: 0, blue: 0, opacity: 1), radius: 2, x: 1, y:1)
    }
    public init() {}
}
`)
})

test("A composite effect with multiple shadows has corresponding SwiftUI", () => {
  const namedEffect: NamedCompositeEffect = {
    name: "myShadow",
    description: "Use this shadow to...",
    effects: [
      {
        color: { red: 1, green: 0, blue: 0, opacity: 1 },
        radius: 2,
        offset: { x: 0, y: 2 },
      },
      {
        color: { red: 0, green: 0, blue: 1, opacity: 1 },
        radius: 2,
        offset: { x: 2, y: 0 },
      },
    ]
  }
  const emittedSwiftUI = emitCompositeEffect(namedEffect)
  expect(emittedSwiftUI).toBe(
`/// Use this shadow to...
public struct MyShadow: ViewModifier {
    public func body(content: Content) -> some View {
        return content
            .shadow(color: Color(red:1, green: 0, blue: 0, opacity: 1), radius: 2, x: 0, y:2)
            .shadow(color: Color(red:0, green: 0, blue: 1, opacity: 1), radius: 2, x: 2, y:0)
    }
    public init() {}
}
`)
})


test("Multiple models have a swiftUI file equivalent", () => {
  const blur: NamedCompositeEffect = {
    name: "myBlur",
    description: "Use this blur to...",
    effects: [
      { radius: 2 },
    ]
  }

  const shadow: NamedCompositeEffect = {
    name: "myShadow",
    description: "Use this shadow to...",
    effects: [
      {
        color: { red: 1, green: 0, blue: 0, opacity: 1},
        radius: 5,
        offset: {x: 1, y: 1},
      }
    ]
  }

  const emittedSwiftUI = emitCompositeEffects([blur, shadow])
  expect(emittedSwiftUI).toBe(`import SwiftUI

public struct Effect {
    /// Xcode's autocomplete allows for easy discovery of design system effects.
    /// At any call site that requires an effect, type \`Effect.DesignSystem.<ctrl-space>\`
    public struct DesignSystem {

        /// Use this blur to...
        public struct MyBlur: ViewModifier {
            public func body(content: Content) -> some View {
                return content
                    .blur(radius: 2)
            }
            public init() {}
        }

        /// Use this shadow to...
        public struct MyShadow: ViewModifier {
            public func body(content: Content) -> some View {
                return content
                    .shadow(color: Color(red:1, green: 0, blue: 0, opacity: 1), radius: 5, x: 1, y:1)
            }
            public init() {}
        }
    }
}

public extension View {
    func myBlur() -> some View {modifier(Effect.DesignSystem.MyBlur())}
    func myShadow() -> some View {modifier(Effect.DesignSystem.MyShadow())}
}
`)
})

// Add support: https://github.com/lzell/dscompiler/issues/8
test("If an effect style contains an inner shadow, we alert the user", () => {
  const style = makeEffectStyle({effects: [makeInnerShadowEffect()]})
  const figma = makePluginAPI({ getLocalEffectStyles: () => { return [style] } })
  inferEffects(figma)
  expect(logToUser).toBeCalledWith('DSCompiler does not yet understand effect type INNER_SHADOW')
})

// Add support: https://github.com/lzell/dscompiler/issues/9
test("If an effect style has a background blur, we alert the user", () => {
  const style = makeEffectStyle({effects: [makeBackgroundBlurEffect()]})
  const figma = makePluginAPI({ getLocalEffectStyles: () => { return [style] } })
  inferEffects(figma)
  expect(logToUser).toBeCalledWith('DSCompiler does not yet understand effect type BACKGROUND_BLUR')
})

// Add support: https://github.com/lzell/dscompiler/issues/10
test("If a shadow effect has a spread, we alert the user", () => {
  const style = makeEffectStyle({effects: [makeDropShadowEffect({ spread: 5 })]})
  const figma = makePluginAPI({ getLocalEffectStyles: () => { return [style] } })
  inferEffects(figma)
  expect(logToUser).toBeCalledWith('DSCompiler can not yet emit code for drop shadows with spreads. Please see https://github.com/lzell/dscompiler/issues/10')
})

