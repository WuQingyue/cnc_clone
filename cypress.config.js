const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // 在这里可以添加Node事件监听器
      // 比如处理浏览器启动参数，或者在测试运行前/后执行一些操作
    },
    baseUrl: 'https://cnc.tongtron.com', // 如果你在这里设置了baseUrl，routing.cy.js中的cy.visit可以简化
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // 确保这里指向你的测试文件
  },
});