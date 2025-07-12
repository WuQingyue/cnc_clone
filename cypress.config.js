const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // ▼▼▼ 【 新增代码块 】 ▼▼▼
      // 注册 'log' 和 'table' 任务，用于在 CI/CD 环境中打印详细的日志和表格
      // 这会让您测试代码中的 cy.task('log', ...) 和 cy.task('table', ...) 命令生效
      on('task', {
        log(message) {
          // 在终端打印带分隔符的日志，使其更清晰
          console.log(`\n\n#️⃣  ${message}\n`);
          return null;
        },
        table(data) {
          // 使用 console.table 在终端打印美观的表格
          console.log('\n┌───────────────── Logged Table ─────────────────┐');
          console.table(data);
          console.log('└──────────────────────────────────────────────────┘\n');
          return null;
        },
      });
      // ▲▲▲ 【 新增代码块结束 】 ▲▲▲

      // 您原有的 webpack 预处理器配置保持不变
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

  // 【建议添加】为组件测试添加配置
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack', // 或者 'vite'，取决于您的项目
    },
    // 将 setupNodeEvents 的逻辑也添加到这里，以支持组件测试中的 cy.task
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(`\n\n#️⃣  ${message}\n`);
          return null;
        },
        table(data) {
          console.log('\n┌───────────────── Logged Table ─────────────────┐');
          console.table(data);
          console.log('└──────────────────────────────────────────────────┘\n');
          return null;
        },
      });

      return config;
    },
  }
});