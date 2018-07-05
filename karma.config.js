module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai"],
    files: [{ pattern: "test/*.js", watched: false }],
    preprocessors: {
      "test/**.js": ["rollup"]
    },
    rollupPreprocessor: {
      plugins: [],
      output: {
        sourcemap: "inline",
        format: "umd",
        name: "quad-tile-tree",
        globals: { chai: "chai" },
        externals: ["chai"]
      }
    },
    reporters: ["progress"],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: true
  });
};
