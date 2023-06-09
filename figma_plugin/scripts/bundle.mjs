import { execSync } from "child_process";

function run(cmd) {
  execSync(cmd, {stdio: "inherit"});
}

run('./node_modules/.bin/esbuild src/code.ts --bundle --outfile=dist/code.js');
run('./node_modules/.bin/esbuild src/ui.ts --bundle --outfile=dist/ui.js')
