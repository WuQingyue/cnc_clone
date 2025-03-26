## 导入包
@public/index.html
```
<script src="https://res.zvo.cn/translate/translate.js"></script>
    <script>
      // 翻译配置
      window.translateConfig = {
        // 排除不需要翻译的元素
        excludeSelectors: [
          '.no-translate',
          '.el-icon',
          // '.logo',
          '.el-dropdown',
          // '.el-button',
          'script',
          'style'
        ],
        // 默认语言
        defaultLang: 'zh',
        // 关闭自动检测
        detectLanguage: false,
        // 设置翻译延迟
        translateDelay: 100,
        // 缓存翻译结果
        cache: true
      }

      // 等待 translate.js 加载完成
      window.onload = function() {
        if (window.translate) {
          // 设置本地语种（当前网页的语种）
          translate.language.setLocal('chinese_simplified');
          
          // 开启页面变化监控，自动翻译变化部分
          translate.listener.start();
          
          // 执行翻译初始化
          translate.execute();

          // 检查是否有保存的语言设置
          const savedLang = localStorage.getItem('preferred_language');
          if (savedLang && savedLang !== 'zh') {
            // 延迟执行翻译，确保页面完全加载
            setTimeout(() => {
              translate.execute(savedLang);
            }, 300);
          }
        }
      }
    </script>
```