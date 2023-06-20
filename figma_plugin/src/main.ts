import { emitColors } from 'src/core/targets/swiftui/emit_colors.ts'
import { emitGradients } from 'src/core/targets/swiftui/emit_gradients.ts'
import { inferColors } from 'src/core/origins/figma/infer_colors.ts'
import { inferGradients } from 'src/core/origins/figma/infer_gradients.ts'

figma.showUI(__html__)

// Returns SwiftUI colors to the caller (the browser environment)
function returnSwiftUIColors() {
  figma.ui.postMessage(
    {
      'message': 'return-export-colors-button-action',
      'argument': {
        'file_name': 'Color.swift',
        'file_body': emitColors(inferColors(figma)),
      }
    }
  )
}

// Returns SwiftUI gradients to the caller (the browser environment)
function returnSwiftUIGradients() {
  figma.ui.postMessage(
    {
      'message': 'return-export-gradients-button-action',
      'argument': {
        'file_name': 'LinearGradient.swift',
        'file_body': emitGradients(inferGradients(figma)),
      }
    }
  )
}

const messageCallDictionary: Record<string, () => void> = {
  'close-button-action': figma.closePlugin,
  'export-colors-button-action': returnSwiftUIColors,
  'export-gradients-button-action': returnSwiftUIGradients,
}

figma.ui.onmessage = msg => {
  const handler: any = messageCallDictionary[msg.type]
  if (handler) {
    handler()
  } else {
    console.assert(false, 'Received a message from the UI that dscompiler does not understand')
  }
}
