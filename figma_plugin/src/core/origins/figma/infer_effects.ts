import { compact } from 'lodash'

// API bridge types
import { IEffect } from 'src/core/origins/figma/api_bridge.ts'
import { IEffectStyle } from 'src/core/origins/figma/api_bridge.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { DSEffect } from 'src/core/models/effect.ts'
import { NamedCompositeEffect } from 'src/core/models/effect.ts'
import { logToUser } from 'src/core/utils/log.ts'
import { sanitizeName } from 'src/core/utils/common.ts'

export function inferEffects(figma: IPluginAPI): ReadonlyArray<NamedCompositeEffect> {
  return compact(figma.getLocalEffectStyles()
                 .map(effectStyleToCompositeEffect))
}

function effectStyleToCompositeEffect(effectStyle: IEffectStyle): NamedCompositeEffect | null  {
  const dseffects = compact(effectStyle.effects.map(effectToDSEffect))
  if (!dseffects.length) {
    return null
  }
  return {
    name: sanitizeName(effectStyle.name),
    description: effectStyle.description,
    effects: dseffects,
  }
}

function effectToDSEffect(effect: IEffect): DSEffect | null {
  if (effect.type == 'LAYER_BLUR') {
    return { radius: effect.radius }
  } else if (effect.type == 'DROP_SHADOW') {
    return {
      color: {
        red: effect.color.r,
        green: effect.color.g,
        blue: effect.color.b,
        opacity: effect.color.a,
      },
      radius: effect.radius,
      offset: effect.offset,
    }
  }
  logToUser(`dscompiler does not yet understand effect type ${effect.type}`)
  return null
}
