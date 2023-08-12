import type { JestConfigWithTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform,
  },

  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['dist'],

  /*
   * What is going on with jest where this is necessary to have the collectCoverageFrom config?
   * Relevant Issue: https://github.com/jestjs/jest/issues/9324
   */
  coverageProvider: 'v8',

  projects: ['core', 'aws', 'github', 'gitlab'].map((name) => ({
    preset: 'ts-jest',
    displayName: `@refreshly/${name}`,
    rootDir: `<rootDir>/packages/${name}`,
    testMatch: ['**/*.spec.ts'],
  })),
};

export default jestConfig;
