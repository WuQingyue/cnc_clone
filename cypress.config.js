const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // 在这里可以添加Node事件监听器
      // 比如处理浏览器启动参数，或者在测试运行前/后执行一些操作

      const options = {
        // 在这里可以自定义webpack配置
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js', '.vue'],
          },
          module: {
            rules: [
              {
                test: /\.vue$/,
                loader: 'vue-loader',
              },
              {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
              }
            ],
          },
        },
      };

      on('file:preprocessor', webpack(options));

      return config;
    },
    baseUrl: 'https://cnc.tongtron.com', // 如果你在这里设置了baseUrl，routing.cy.js中的cy.visit可以简化
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // 确保这里指向你的测试文件
  },
});