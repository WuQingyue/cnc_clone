// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
  
    testEnvironmentOptions: {
      customExportConditions: ["node", "node-addons"],
    },
  
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
  
    moduleFileExtensions: ['vue', 'js', 'json', 'jsx'],
  
    moduleNameMapper: {
      // 首先处理 @ 别名
      '^@/(.*)$': '<rootDir>/src/$1',
  
      // ❗️【核心修复】为静态资源（如图片和样式）添加 Mock
      // 这会告诉 Jest 将匹配到的文件导入替换为我们创建的 mock 文件的路径
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/fileMock.js',
      '\\.(css|scss|sass|less)$': '<rootDir>/jest/fileMock.js',
    },
  };