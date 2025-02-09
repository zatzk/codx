/* eslint-disable @typescript-eslint/no-empty-function */
import type { Config } from '@jest/types'
import { loadEnvConfig } from '@next/env'

// Load environment variables
loadEnvConfig(process.cwd(), true, { 
  error: console.error,
  info: () => {} 
})

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: 'reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        theme: 'defaultTheme',
        pageTitle: 'Test Report',
        sort: 'status',
      },
    ],
  ],
}

export default config