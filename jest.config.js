module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ["**/src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\build\\\\"],
  moduleFileExtensions: ["js", "json", "jsx"],
  modulePathIgnorePatterns: ["<rootDir>/builds", "<rootDir>/build"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};
