### CNC加工

### 文件格式检查

### 上传框设置

### 检查文件大小

### 检查文件格式

### 文件数量

```
src
├── components
│   ├── CustomerGuidance
│   │   ├── cnc.vue # CNC加工
│   │   ├── sheet.vue # 钣金加工
│   │   ├── hand.vue # 手板模型
│   │   ├── 2D.vue # 2D设计
│   │   ├── KeepSecret.vue # 保密协议
│   ├── quote
│   │   ├── ProcessSelector.vue # 加工工艺选择
│   │   ├── FileUploader.vue # 文件上传
│   │   ├── HistoryList.vue # 历史记录
│   │   ├── FileList.vue # 文件列表
│   │   ├── processList.js # 加工工艺列表
│   │   ├── AutomationTool.js # 自动化工具参数
│   │   ├── ParameterInfo.vue # 参数信息弹出框
├── views
│   ├── CustomerGuidance.vue  #包含所有组件的视图
├── router
│   └── index.js # 路由
Readme
└── Quote.md # 成员文档
```

参数表面处理可叠加
喷砂+普通阳极氧化 - 激光打标 
喷砂+普通阳极氧化 - 丝印  
喷砂+导电氧化 - 激光打标 
喷砂+导电氧化 - 丝印 
喷砂+硬质阳极氧化 - 激光打标 
喷砂+硬质阳极氧化 - 丝印 
激光打标 - 拉丝
激光打标 - 仅喷砂
激光打标 - 普通阳极氧化(不喷砂)
激光打标 - 导电氧化(不喷砂)
激光打标 - 硬质阳极氧化(不喷砂)
激光打标 - 拉丝+普通阳极氧化
拉丝 - 丝印
仅喷砂 - 丝印
普通阳极氧化(不喷砂) - 丝印
导电氧化(不喷砂) - 丝印
硬质阳极氧化(不喷砂) - 丝印
拉丝+普通阳极氧化 - 丝印















