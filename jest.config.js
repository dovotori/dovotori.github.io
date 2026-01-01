export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["**/src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\build\\\\"],
  moduleFileExtensions: ["js", "json", "jsx"],
  modulePathIgnorePatterns: ["<rootDir>/builds", "<rootDir>/build"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
