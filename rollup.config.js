export default {
  input: "src/index.js",
  output: {
    file: "dist/quad-tile-tree.js",
    format: "umd",
    name: "quad-tile-tree",
    globals: { debug: "debug" }
  },
  external: ["debug"]
};
