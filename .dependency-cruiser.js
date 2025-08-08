/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [],
  options: {
    tsConfig: { fileName: "./tsconfig.json" },
    doNotFollow: { path: ["node_modules"] },
    exclude: { path: ["node_modules", "dist", "build", "coverage"] },
    includeOnly: ["^src"],
    reporterOptions: { dot: { collapsePattern: "node_modules" } }
  }
};
