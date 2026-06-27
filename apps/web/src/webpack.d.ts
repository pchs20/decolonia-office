// Webpack's official escape hatch for the real Node.js `require`.
// Webpack replaces __non_webpack_require__ with the native require, bypassing
// its own module resolution (and Next.js's RSC-vendored React alias).
declare const __non_webpack_require__: NodeRequire;
