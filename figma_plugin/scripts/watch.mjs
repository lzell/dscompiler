import fs from 'fs';
import path from 'path';
import debounce from 'debounce';
import { spawn, execSync } from 'child_process';

const fileExtensionsToWatch = ['.ts', '.js', '.html', '.css', '.liquid'];

// Creates a debounced version of 'fileDidChangeHandler'
// to accommodate the rapid callback executions from 'fs.watch'.
// Without this, we would act on file changes multiple times
// per single file change.
const fileDidChangeFn = debounce(fileDidChangeHandler, 100, true);

// Runs a shell command synchronously, and catches all errors.
function runAndIgnoreErrors(cmd) {
  try {
    execSync(cmd, {stdio: "inherit"});
  } catch(error) {}
}

// Handle file changes to `filename`
function fileDidChangeHandler(filename) {
  console.log("\nThe file", filename, "was modified!");

  // I could be a lot smarter here and only bundle
  // the UI when the UI changes, etc.
  //
  // For now, I'll rebuild everything on every change.
  bundleAndTypecheck();
}

// Builds the full project, and typechecks it
function bundleAndTypecheck() {
  runAndIgnoreErrors("npm run build");
  runAndIgnoreErrors("npm run typecheck");
}

// Watch for file system changes
fs.watch("src", (eventType, filename) => {
  if (fileExtensionsToWatch.includes(path.extname(filename))) {
    fileDidChangeFn(filename)
  }
});

// Build everything one time when I run 'npm run watch'.
// Otherwise, I need to make a file change for the project to be
// up to date.
bundleAndTypecheck();
