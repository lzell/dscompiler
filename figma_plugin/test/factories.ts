import { PaintProtocol } from '../src/core/origins/figma/api_bridge.ts'
import { PaintStyleProtocol } from '../src/core/origins/figma/api_bridge.ts'
import { SolidPaintProtocol } from '../src/core/origins/figma/api_bridge.ts'


interface FactoryPaintStyleProtocol {
  name?: string
  description?: string
  paints?: ReadonlyArray<PaintProtocol>
}

export function makePaintStyle({ name, description, paints }: FactoryPaintStyleProtocol = {})
: PaintStyleProtocol {
  return {
    name: name || "default color",
    description: description || "default description",
    paints: paints || [makePaint()]
  }
}

function makePaint(): SolidPaintProtocol {
  return {type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.5}
}
