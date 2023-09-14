import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['build'],
};

export default jestConfig;
