import { rmSync } from "node:fs";

// Next can leave incompatible Turbopack and production artifacts in the same
// directory when a dev server and a build overlap. Always start verification
// from a known-good generated state.
rmSync(".next", { recursive: true, force: true });
