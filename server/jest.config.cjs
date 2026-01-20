module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: false
      }
    ]
  },

  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.spec.ts",
    "**/__tests__/**/*.ts"
  ]
};
