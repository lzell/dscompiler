## How to build the project

### Prerequisites

- Node. [nvm](https://github.com/nvm-sh/nvm) is a good option for installing node.

- Typescript. I install this globally with `npm install -g typescript`.
  Other install options are [listed here](https://www.typescriptlang.org/download)

- Git. I use [homebrew](https://brew.sh/) to install this with `brew install git`.
  Other install options are [listed here](https://github.com/git-guides/install-git)

- Figma Desktop. Download [here](https://www.figma.com/downloads/)


### Building and running the project for the first time

- Install prerequisites above. Then:

    ```
    git clone git@github.com:lzell/dscompiler.git
    cd dscompiler/figma_plugin
    npm install
    npm run build
    ```

- Make the plugin available in Figma Desktop:
  - Navigate through Figma's menu bar: `Plugins > Development > Import plugin from manifest`
  - Select the manifest file at `<your-source-code-dir>/dscompiler/figma_plugin/manifest.json`

- Run the plugin for the first time by navigating: `Plugins > Development > dscompiler`
  - Run the plugin subsequent times with the keyboard shortcut `cmd+opt+p`


### Building the project automatically on source file changes

- Run the bundler and typechecker on every source change:

    ```
    cd <project-dir>/figma_plugin
    npm run watch
    ```

### How to run tests

Run tests a single time:

    cd <project-dir>/figma_plugin
    npm run test

Run tests on filesystem changes to `figma_plugin/src` and `figma_plugin/test`:

    cd <project-dir>/figma_plugin
    npm run watch_test
    :: type 'a' when jest prompt appears


### How to debug tests

Inside the repl:

    node inspect node_modules/.bin/jest <filename>

Inside devtools:

    1. Open devtools:
      - Open Chrome
      - Punch `about:inspect` into the address bar
      - Tap on 'Open dedicated DevTools for Node'

    2. Add a `debugger` statement to the source

    3. Run `jest` with the following:

        node --inspect-brk node_modules/.bin/jest --runInBand

      To test a single file, use:

        node --inspect-brk node_modules/.bin/jest --runInBand <filename>

### How to run the linter

Run linter:

    cd <project-dir>/figma_plugin
    npm run linter

Run linter and apply fixes:

    cd <project-dir>/figma_plugin
    npm run linter_fixer


### Mapping Figma text styles to SwiftUI fonts

- If your Figma designs use [SF or New York fonts](https://developer.apple.com/fonts/), dscompiler will map them to system fonts automatically.
- For all other fonts, check to see if your desired font has a gear icon next to it in [Apple's system font list](https://developer.apple.com/fonts/system-fonts/)
  - If the gear icon is present, then dscompiler will map your Figma text styles to custom font without any work on your end.
  - If the gear icon is missing, then you must add your custom font to Xcode for dscompiler's mapping to work as expected.
    - How to add a custom font to Xcode: [link](https://www.louzell.com/notes/swiftui_custom_font.html)
  - See the reference app [FontBrowser](https://github.com/lzell/FontBrowser) to view all built-in iOS fonts.
- It would be great if we could automate this all away. Let the designer pick the font they want, and we modify the Xcode project if needed.
  - From the Apple docs for using a build-in font: "You can find the postscript name of a font by opening it with the Font Book app and selecting the Font Info tab", [source](https://developer.apple.com/documentation/swiftui/applying-custom-fonts-to-text/)

## References for project setup files

- `manifest.json`
[Figma's plugin definition](https://www.figma.com/plugin-docs/manifest/)

- `package.json`
[Node's package definition](https://nodejs.org/api/packages.html)

- `tsconfig.json`
[Typescript project configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

- `jest.config.js`
[Jest configuration for unit tests](https://jestjs.io/docs/configuration)
