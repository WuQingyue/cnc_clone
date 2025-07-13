const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

// --- 【第1步：重构】将 Webpack 配置提取为一个独立的常量，以便复用 ---
const sharedWebpackConfig = {
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
  plugins: [
    new VueLoaderPlugin()
  ]
};

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // --- 【第2步：复用】在 E2E 测试中引用共享配置 ---
      const options = {
        webpackOptions: sharedWebpackConfig
      };
      on('file:preprocessor', webpack(options));
      return config;
    },
    baseUrl: 'https://cnc.tongtron.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack',
      // --- 【第3步：复用】将相同的共享配置提供给组件测试的 devServer ---
      webpackConfig: sharedWebpackConfig,
    },
    indexHtmlFile: 'cypress/support/component-index.html',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
});