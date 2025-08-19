import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/utils'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['utils/**/*.ts', '!utils/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@kingstinct/react-native-healthkit)/)',
  ],
} as JestConfigWithTsJest;
