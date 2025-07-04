const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: ["<rootDir>/tests/setup-env.js"],
  testTimeout: 60000,
});

module.exports = jestConfig;
