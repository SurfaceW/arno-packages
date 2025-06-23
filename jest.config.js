/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'client',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/client/**/*.test.ts'],
      moduleNameMapping: {
        '^@arno/shared$': '<rootDir>/shared/index.ts',
        '^@arno/shared/(.*)$': '<rootDir>/shared/$1',
      },
    },
    {
      displayName: 'shared',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/shared/**/*.test.ts'],
    },
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/**/*.test.ts'],
      moduleNameMapping: {
        '^@arno/shared$': '<rootDir>/shared/index.ts',
        '^@arno/shared/(.*)$': '<rootDir>/shared/$1',
      },
    },
  ],
  collectCoverageFrom: [
    'client/**/*.ts',
    'shared/**/*.ts',
    'server/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.test.ts',
  ],
}; 