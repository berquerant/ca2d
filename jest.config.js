/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/*.test.ts"],
};
