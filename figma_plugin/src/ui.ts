import { saveAs } from 'file-saver'


// When a user taps a button in the UI, I pass an event to the plugin sandbox
// of the form '<name>-action'. The plugin sandbox is then responsible for
// returning a message of form 'return-<name>-action'.
//
// Attach a handler here to respond to these return messages, and route
// them to the right place.
window.onmessage = async (event) => {
  const pluginMessage = event.data?.pluginMessage
  console.assert(pluginMessage, "Expecting a plugin message")
  switch (pluginMessage['message']) {
    case 'return-export-button-action':
      exportButtonActionDidReturn(pluginMessage['argument'])
      break
    case 'return-export-text-styles':
    default:
      console.assert(false, 'Received an unsupported message from the plugin: ' + event.data.pluginMessage['message'])
      break
  }
}

// Handle the 'return-export-button-action' message
function exportButtonActionDidReturn(messageArgument: any) {
  const fileName = messageArgument['file_name']
  const fileBody = messageArgument['file_body']
  console.assert(fileName, 'missing required file_name argument')
  console.assert(fileBody, 'missing required file_body argument')
  saveAs(new Blob([fileBody], {type: "text/plain;charset=utf-8"}), fileName)
}


// Attaches handlers to UI buttons that sends the `action` message to
// the figma plugin sandbox. The `buttonsAndActions` argument has the following form:
//
//    [
//      ['buttonId1', 'some-action'],
//      ['buttonId2', 'another-action'],
//    ]
//
function attachButtonActions(buttonsAndActions: [string, string][]) {
  for (const [buttonId, action] of buttonsAndActions) {
    const button = document.getElementById(buttonId)
    if (button) {
      button.onclick = () => {
        parent.postMessage({ pluginMessage: { type: action } }, '*')
      }
    } else {
      console.assert(false, `Expected the UI to contain a tag with id ${buttonId}`)
    }
  }
}


// Attach button actions:
attachButtonActions([
  ['close-button', 'close-button-action'],
  ['export-button', 'export-button-action'],
])
