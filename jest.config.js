// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['vue', 'js', 'json', 'jsx'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // 允许在测试中使用 @/ 别名
    },
  };