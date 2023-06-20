module.exports = {
  "roots": [
    "./test",
    // I add './src' here so that `npm run watch_test` reruns tests whenever
    // changes are made to files under the `src` tree.
    // There are no tests in the `src` tree.
    "./src",
  ],
  "modulePaths": [
    "<rootDir>",
  ],
  "testMatch": [
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}

