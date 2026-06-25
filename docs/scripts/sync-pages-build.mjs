import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

for (const name of ["assets", "data"]) {
  const source = resolve(dist, name);
  const target = resolve(root, name);
  if (!existsSync(source)) continue;
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
}

cpSync(resolve(dist, "index.html"), resolve(root, "index.html"));
