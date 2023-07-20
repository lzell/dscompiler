import { emitColors } from 'src/core/targets/swiftui/emit_colors.ts'
import { emitCompositeEffects } from 'src/core/targets/swiftui/emit_effects.ts'
import { emitFonts } from 'src/core/targets/swiftui/emit_fonts.ts'
import { emitGradients } from 'src/core/targets/swiftui/emit_gradients.ts'
import { inferColors } from 'src/core/origins/figma/infer_colors.ts'
import { inferEffects } from 'src/core/origins/figma/infer_effects.ts'
import { inferFonts } from 'src/core/origins/figma/infer_fonts.ts'
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

// Returns SwiftUI effects to the caller (the browser environment)
function returnSwiftUIEffects() {
  figma.ui.postMessage(
    {
      'message': 'return-export-effects-button-action',
      'argument': {
        'file_name': 'Effect.swift',
        'file_body': emitCompositeEffects(inferEffects(figma)),
      }
    }
  )
}

// Returns SwiftUI fonts to the caller (the browser environment)
function returnSwiftUIFonts() {
  figma.ui.postMessage(
    {
      'message': 'return-export-fonts-button-action',
      'argument': {
        'file_name': 'Font.swift',
        'file_body': emitFonts(inferFonts(figma)),
      }
    }
  )
}

// Returns SwiftUI images to the caller (the browser environment)
function returnSwiftUIImages() {
  inferImages(figma).then((res) => {
    console.log(res)
    //figma.ui.postMessage(
    //  {
    //    'message': 'return-export-fonts-button-action',
    //    'argument': {
    //      'file_name': 'Font.swift',
    //      'file_body': emitFonts(res),
    //    }
    //  }
    //)

  }).catch((err) => {
    console.assert(false, err)
  })
  const frameRegex = new RegExp(/images?\.swift/, 'ig')
  const frameAlternateRegex = new RegExp(/swift\.images?/, 'ig')
  const frameNodes: FrameNode[] = figma.currentPage.children.filter(node =>
    node.type == 'FRAME' && (node.name.match(frameRegex) || node.name.match(frameAlternateRegex))
  )

}


const messageCallDictionary: Record<string, () => void> = {
  'close-button-action': figma.closePlugin,
  'export-colors-button-action': returnSwiftUIColors,
  'export-effects-button-action': returnSwiftUIEffects,
  'export-fonts-button-action': returnSwiftUIFonts,
  'export-gradients-button-action': returnSwiftUIGradients,
  'export-images-button-action': returnSwiftUIImages,
}

figma.ui.onmessage = msg => {
  const handler: any = messageCallDictionary[msg.type]
  if (handler) {
    handler()
  } else {
    console.assert(false, 'Received a message from the UI that dscompiler does not understand')
  }
}
