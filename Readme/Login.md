## 目录
```
src
├── components
│   ├── SignIn
│   │   ├── Login.vue # 登录组件
│   │   ├── PartAuditInfo.vue # 零件审核信息
│   │   ├── OrderInfo.vue # 订单信息
│   │   ├── UserInfo.vue # 用户信息
│   │   ├── LogisticsInfo.vue # 物流信息
│   │   ├── ModelInfoDialog.vue # 模型信息弹出框
│   │   ├── AmountDialog.vue # 加工金额弹出框
│   │   ├── eventBus.js # 事件总线
├── router
│   └── index.js # 路由
├── views
│   ├── Admin
│   │   ├── Admin.vue # 管理员界面视图
Readme
└── Login.md # 成员文档
```
用户点击"Continue with Google"
          ↓
重定向到 Google 登录页面
          ↓
用户在 Google 页面登录
          ↓
Google 重定向回应用（带授权码）
          ↓
onMounted 检测到授权码
          ↓
调用 handleGoogleCallback
          ↓
用授权码换取访问令牌
          ↓
获取用户信息
          ↓
保存用户状态
          ↓
跳转到首页