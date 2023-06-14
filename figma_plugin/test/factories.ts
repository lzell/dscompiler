import { IPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from '../src/core/origins/figma/api_bridge.ts'
import { ISolidPaint } from '../src/core/origins/figma/api_bridge.ts'


interface _IPaintStyle {
  name?: string
  description?: string
  paints?: ReadonlyArray<IPaint>
}

export function makePaintStyle({ name, description, paints }: _IPaintStyle = {})
: IPaintStyle {
  return {
    name: name || "default color",
    description: description || "default description",
    paints: paints || [makePaint()]
  }
}

function makePaint(): ISolidPaint {
  return {type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.5}
}
