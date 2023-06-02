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
    npm run bundle
    ```

- Make the plugin available in Figma Desktop:
  - Navigate through Figma's menu bar: `Plugins > Development > Import plugin from manifest`
  - Select the manifest file at `<your-source-code-dir>/dscompiler/figma_plugin/manifest.json`

- Run the plugin for the first time by navigating: `Plugins > Development > dscompiler`
  - Run the plugin subsequent times with the keyboard shortcut `cmd+opt+p`


### Building the project automatically on source file changes

- Install GNU Parallel. I use [homebrew](https://brew.sh/) to install this with `brew install parallel`

- Run the bundler and typechecker on every source change:

    ```
    cd <project-dir>/figma_plugin
    npm run watch
    ```

Note that the output of the typechecker (`tsc`) and bundler (`esbuild`) are intermingled in the `npm run watch` output.  
If you'd like to observe the processes separately, use two different shells:

    shell1> npm run watch_bundler
    shell2> npm run watch_typechecker


### How to run tests

Run tests a single time:

    cd <project-dir>/figma_plugin
    npm run test

Run tests on filesystem changes to `figma_plugin/src` and `figma_plugin/test`:

    cd <project-dir>/figma_plugin
    npm run watch_test
    :: type 'a' when jest prompt appears


### How to run the linter

Run linter:

    cd <project-dir>/figma_plugin
    npm run linter

Run linter and apply fixes:

    cd <project-dir>/figma_plugin
    npm run linter_fixer


## References for project setup files

- `manifest.json`
[Figma's plugin definition](https://www.figma.com/plugin-docs/manifest/)

- `package.json`
[Node's package definition](https://nodejs.org/api/packages.html)

- `tsconfig.json`
[Typescript project configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

- `jest.config.js`
[Jest configuration for unit tests](https://jestjs.io/docs/configuration)
