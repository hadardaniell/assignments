/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // 1. Switch to the standard preset
  preset: 'ts-jest',
  
  // 2. Set environment to Node
  testEnvironment: 'node',
  
  // 3. Remove extensionsToTreatAsEsm (not needed for CJS)
  
  // 4. Keep the mapper if you have .js extensions in your code
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  // 5. Simplify the transform
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: false, // Turn off ESM
      },
    ],
  },
};