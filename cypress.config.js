const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
// 【第1步】从 'vue-loader' 中引入 VueLoaderPlugin
const { VueLoaderPlugin } = require('vue-loader');

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
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
              {
                test: /\.vue$/,
                loader: 'vue-loader',
              },
              {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
              },
              {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader'],
              },
              // 【新增】为字体和图片文件添加加载器
              // 否则Webpack不知道如何处理组件中引用的这些资源
              {
                test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
                type: 'asset/resource'
              },
              {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource'
              }
            ],
          },
          // 【第2步】添加 plugins 数组并使用 VueLoaderPlugin
          plugins: [
            new VueLoaderPlugin()
          ]
        },
      };

      on('file:preprocessor', webpack(options));

      return config;
    },
    baseUrl: 'https://cnc.tongtron.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});