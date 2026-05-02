module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__test__/**/*.test.[jt]s'],
  transform: {
    '^.+\\.[jt]s$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^common/(.*)$': '<rootDir>/src/common/$1',
    '^middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^middlewares$': '<rootDir>/src/middlewares/index.ts',
    '^decorators$': '<rootDir>/src/decorators/index.ts',
    '^exceptions$': '<rootDir>/src/exceptions/index.ts',
    '^functions$': '<rootDir>/src/functions/index.ts',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^metadata/(.*)$': '<rootDir>/src/metadata/$1',
    '^gateways/(.*)$': '<rootDir>/src/gateways/$1',
    '^modules$': '<rootDir>/src/modules/index.ts',
    '^pipe$': '<rootDir>/src/pipe/index.ts',
    '^tasks/(.*)$': '<rootDir>/src/tasks/$1',
    '^validation/(.*)$': '<rootDir>/src/validation/$1'
  },
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/migrations/',
    '/src/seeds/',
    '/src/scripts/'
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary'],
  resolver: './jestResolver.js',
  forceExit: true,
  testTimeout: 10000
}
