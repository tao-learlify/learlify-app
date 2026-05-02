module.exports = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^utils/colors$': '<rootDir>/src/colors'
  },
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
  testEnvironment: 'jsdom'
}
