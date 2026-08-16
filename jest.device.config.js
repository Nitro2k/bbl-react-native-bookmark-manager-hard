const baseConfig = require("./package.json").jest;

module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/*.device.test.ts"],
};
