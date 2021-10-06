module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "coverageDirectory": "media",
  "coverageReporters": [
    "json-summary",
    "text",
    "lcov"
  ]
}
