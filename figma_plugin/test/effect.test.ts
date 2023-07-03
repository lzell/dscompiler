// API bridge types
import { IEffect } from '../src/core/origins/figma/api_bridge.ts'
import { IEffectStyle } from '../src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { Blur } from '../src/core/models/effect.ts'
import { NamedCompositeEffect } from '../src/core/models/effect.ts'
import { Shadow } from '../src/core/models/effect.ts'
import { effectToDSEffect } from '../src/core/origins/figma/infer_effects.ts'
import { emitEffect } from '../src/core/targets/swiftui/emit_effects.ts'
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

test("If an effect style contains an inner shadow, we alert the user", () => {
  const style = makeEffectStyle({effects: [makeInnerShadowEffect()]})
  const figma = makePluginAPI({ getLocalEffectStyles: () => { return [style] } })
  inferEffects(figma)
  expect(logToUser).toBeCalledWith('DSCompiler does not yet understand effect type INNER_SHADOW')
})

test("If an effect style has a background blur, we alert the user", () => {
  const style = makeEffectStyle({effects: [makeBackgroundBlurEffect()]})
  const figma = makePluginAPI({ getLocalEffectStyles: () => { return [style] } })
  inferEffects(figma)
  expect(logToUser).toBeCalledWith('DSCompiler does not yet understand effect type BACKGROUND_BLUR')
})

test("A layer blur figma effect is converted into a Blur model", () => {
  const figmaEffect = makeLayerBlurEffect({radius: 1})
  const blurModel = effectToDSEffect(figmaEffect)
  expect(blurModel).toMatchObject({radius: 1})
})

test("A drop shadow figma effect is converted into a Shadow model", () => {
  const figmaEffect = makeDropShadowEffect({
    color: {r: 1, g: 0, b: 0, a: 1},
    offset: {x: 9, y: 9},
    radius: 1,
    spread: 5
  })
  const shadowModel = effectToDSEffect(figmaEffect)
  expect(shadowModel).toMatchObject({
    color: {red: 1, green: 0, blue: 0, opacity: 1},
    radius: 1,
    offset: {x: 9, y: 9},
    spread: 5
  })
})

test("A drop shadow without a spread defaults to a null spread", () => {
  const figmaEffect = makeDropShadowEffect()
  const shadowModel = effectToDSEffect(figmaEffect)
  expect(shadowModel).toMatchObject({
    spread: null
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
          spread: 1
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
        radius: 1,
        spread: 1
      },
      {
        radius: 2
      }
    ]
  })
})

test("A blur model has corresponding SwiftUI", () => {
  const blur: Blur = {radius: 5}
  const swiftUI = emitEffect(blur)
  expect(swiftUI).toBe(".blur(radius: 5)\n")
})

test("A drop shadow model without spread has corresponding SwiftUI", () => {
  const shadow: Shadow = {
    color: { red: 1, green: 0, blue: 0, opacity: 1},
    radius: 5,
    offset: {x: 1, y: 1},
    spread: null
  }
  const swiftUI = emitEffect(shadow)
  expect(swiftUI).toBe(".shadow(color: Color(red:1, green: 0, blue: 0, opacity: 1), radius: 5, x: 1, y:1)\n")
})

// This will fail. There is no spread logic yet.
// test("A drop shadow with spread has corresponding SwiftUI", () => {
// }
