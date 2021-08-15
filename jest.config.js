module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "coverageDirectory": "docs/coverage",
  "coverageReporters": [
    "json-summary",
    "text",
    "lcov"
  ]
}