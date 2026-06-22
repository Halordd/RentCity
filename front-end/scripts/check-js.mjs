import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../src");

function collectJsFiles(dir) {
  return readdirSync(dir)
    .flatMap((name) => {
      const fullPath = join(dir, name);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) return collectJsFiles(fullPath);
      return name.endsWith(".js") ? [fullPath] : [];
    });
}

for (const file of collectJsFiles(root)) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

console.log("Checked all frontend JavaScript modules.");
