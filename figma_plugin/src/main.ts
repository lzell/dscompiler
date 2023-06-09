import { inferColors } from 'src/core/origins/figma/infer_colors.ts'
import { emitColors } from 'src/core/targets/swiftui/emit_colors.ts'

figma.showUI(__html__)

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'close-button-action': {
      figma.closePlugin()
      break
    }
    case 'export-button-action': {
      const colors = inferColors(figma)
      const swiftColors = emitColors(colors)
      figma.ui.postMessage(
        {
          'message': 'return-export-button-action',
          'argument': {
            'file_name': 'Color.swift',
            'file_body': swiftColors,
          }
        }
      )
      break
    }
    default: {
      console.assert(false, 'Received a message from the UI that dscompiler does not understand')
      break
    }
  }
}
