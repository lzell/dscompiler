// Builds dist/ui.html from src/ui.html.liquid
//
// Usage
// -----
// It's most convenient to run this script as part of `npm run bundle_ui`.
//
// However, the script can be invoked on its own with `node scripts/buildui.mjs`.
// If you are invoking it this way, make sure the dependency `dist/ui.js` is up to date.
import { Liquid } from 'liquidjs'
import fs from 'fs'

const bundledJS = fs.readFileSync('dist/ui.js')
const engine = new Liquid()
engine
  .renderFile("src/ui.html.liquid", {bundledJS: bundledJS})
  .then((res) => {
    fs.writeFileSync('dist/ui.html', res)
  })

console.log('\x1b[32m   Wrote dist/ui.html \x1b[0m');
