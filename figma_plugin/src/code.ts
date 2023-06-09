import { inferColors } from 'src/core/origins/figma/infer_colors.ts'
import { emitColors } from 'src/core/targets/swiftui/emit_colors.ts'


const colors = inferColors(figma)
console.log(emitColors(colors))

figma.showUI(__html__)

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin()
