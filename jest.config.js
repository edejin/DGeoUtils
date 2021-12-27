module.exports = {
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  coverageDirectory: 'media',
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        outputPath: './media/time-report.html'
      }
    ]
  ]
};
