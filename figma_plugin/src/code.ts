import { inferColors } from 'src/core/origins/figma/infer_colors.ts'
import { emitColors } from 'src/core/targets/swiftui/emit_colors.ts'

const colors = inferColors(figma)
console.log(emitColors(colors))

figma.showUI(__html__)

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'close-button-action':
      figma.closePlugin()
      break
    default:
      console.assert(false, 'Received a message from the UI that dscompiler does not understand')
      break
  }
}
