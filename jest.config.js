// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
  
    // ❗️【核心修复】添加这个配置项
    // 这会告诉 Jest 使用 Node.js 的模块解析规则，从而加载正确的 Test Utils 文件
    testEnvironmentOptions: {
      customExportConditions: ["node", "node-addons"],
    },
  
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['vue', 'js', 'json', 'jsx'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };