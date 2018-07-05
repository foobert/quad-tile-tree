module.exports = {
  env: {
    es6: true,
    node: true
  },
  sourceType: "module",
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    "no-console": "off"
  }
};
