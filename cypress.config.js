const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = defineConfig({
  // --- E2E 测试配置保持不变 ---
  e2e: {
    async setupNodeEvents(on, config) {
      // 您的 Webpack 预处理器配置很好，保持原样
      const options = {
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js', '.vue', '.json'],
            alias: {
              '@': path.resolve(__dirname, './src'),
            }
          },
          module: {
            rules: [
              { test: /\.vue$/, loader: 'vue-loader' },
              { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
              { test: /\.scss$/, use: ['vue-style-loader', 'css-loader', 'sass-loader'] },
              { test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/, type: 'asset/resource' },
              { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, type: 'asset/resource' }
            ],
          },
          plugins: [ new VueLoaderPlugin() ]
        },
      };
      on('file:preprocessor', webpack(options));
      return config;
    },
    baseUrl: 'https://cnc.tongtron.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },

  // --- 【新增】组件测试配置 ---
  component: {
    // 告诉 Cypress 组件测试使用哪个开发服务器
    devServer: {
      framework: 'vue', // 明确指定框架
      bundler: 'webpack', // 明确指定打包工具
    },
    // 告诉 Cypress 组件测试的“画布”文件在哪里
    indexHtmlFile: 'cypress/support/component-index.html',
    // 指定组件测试文件的存放位置
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false, 
  },
});