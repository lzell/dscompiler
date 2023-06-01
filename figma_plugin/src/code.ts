import { getColors } from './color.ts'



getColors(figma).then((res) => {
  console.log({res})
  //const [icons, fonts, colors] = res
  //sharedIcons = icons
  //sharedFonts = fonts
  //sharedColors = colors
  //const icon_names = new Set(icons.map(icon => icon.name))
  //return getButtons(colors, fonts, icon_names)
})
.catch((err) => {
  console.log("Setup failure")
  console.log(err)
  console.assert(false, "Could not set up")
  // TODO: display alert to user!
})

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
