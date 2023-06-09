import { saveAs } from 'file-saver'
const blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"})
saveAs(blob, "hello world.txt")

const closeButton = document.getElementById('close-button')
if (closeButton) {
  closeButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'close-button-action' } }, '*')
  }
} else {
  console.assert(false, "Expected the UI to contain a tag with id 'close-button'")
}
