export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Para usar alias como en Vite
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx", // excluye el entrypoint
  ],
};
