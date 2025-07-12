const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');
const path = require('path'); // 引入 Node.js 的 'path' 模块

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // 在这里可以添加Node事件监听器
      // 比如处理浏览器启动参数，或者在测试运行前/后执行一些操作

      const options = {
        // 在这里可以自定义webpack配置
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js', '.vue', '.json'], // 建议加上.json以防万一
            alias: {
              // 【这是本次的核心修改】
              // 添加路径别名配置，让 '@' 指向你项目的 'src' 目录
              '@': path.resolve(__dirname, './src'),
            }
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
              },
              // 如果你的Vue组件中使用了SCSS，你还需要添加SASS的加载器
              // 从你的package.json看，你安装了sass-loader，所以最好加上
              {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader'],
              }
            ],
          },
        },
      };

      on('file:preprocessor', webpack(options));

      // 总是返回 config 对象是个好习惯
      return config;
    },
    baseUrl: 'https://cnc.tongtron.com', // 如果你在这里设置了baseUrl，routing.cy.js中的cy.visit可以简化
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // 确保这里指向你的测试文件
  },
});