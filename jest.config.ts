import type { JestConfigWithTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform,
  },

  collectCoverageFrom: ['<rootDir>/src/**/*'],

  /*
   * What is going on with jest where this is necessary to have the collectCoverageFrom config?
   * Relevant Issue: https://github.com/jestjs/jest/issues/9324
   */
  coverageProvider: 'v8',

  modulePaths: ['<rootDir>'],
};

export default jestConfig;
