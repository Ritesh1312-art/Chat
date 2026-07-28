import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '@viberoom/types': '<rootDir>/../../packages/types/index.ts'
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts']
}

export default config
