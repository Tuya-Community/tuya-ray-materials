# Ray 官方示例项目

[English](README.md) | [简体中文](README_zh.md)

本项目包含了丰富的组件示例和API演示，帮助开发者快速了解和掌握 Ray 框架的使用方法。

## 在 IDE 中开发

使用支持 Raypack 的涂鸦小程序 IDE 打开项目根目录。Raypack 由 IDE 提供，开发、预览和构建由 IDE 执行。

使用 Yarn Classic（1.x）按仓库中的 `yarn.lock` 安装项目依赖。

```sh
yarn install --frozen-lockfile
```

真机预览或发布前，将 `project.tuya.json` 中的占位 `projectId` 替换成你的小程序项目 ID。

## 用本地 Raypack CLI 验证

如果本机已有 Raypack CLI，可在项目根目录执行以下命令。用 Node.js 运行 CLI 时，版本须为 22.12 或以上。两种构建使用独立的输出目录，便于对照产物。

```sh
raypack check .
raypack repair . --dry-run
raypack build . --ide --output dist/full
raypack build . --ide --sub-packages --output dist/split
```

全量构建的主包写入 `dist/full/miniprogram/`，分包构建的主包写入 `dist/split/__APP__/`。

## 📁 项目结构

```
├── src/
│   ├── api/                # API 示例页面
│   ├── basic/              # 基础组件示例
│   ├── components/         # 可复用组件库
│   ├── pages/              # 页面组件
│   ├── common/             # 公共组件
│   ├── utils/              # 工具函数
│   ├── app.tsx             # 应用入口
│   ├── global.config.ts     # 小程序全局配置
│   ├── i18n/strings.ts      # 中英文词条
│   └── routes.config.ts    # 路由配置
├── public/                 # 静态资源
├── typings/                # 类型定义
├── package.json            # 项目配置
├── project.tuya.json       # 涂鸦项目配置
└── ray.config.ts           # Raypack 配置
```

## 中英双语

`src/i18n/strings.ts` 按 `en`、`zh` 分组维护中英文词典，两种语言使用相同的语义 key。

页面、组件与提示文案直接使用系统提供的全局 `I18n.t()`，无需导入或自行初始化：

```tsx
<Text>{I18n.t('basicComponents')}</Text>
```

新增文案时在中英文词典中添加同名 key。分类数据保存 key，由 NavPanel 在渲染时翻译；组件名及 API 名保留原样。中文开发日志和注释不翻译。

导航栏及 Tab 的静态配置使用 `@I18n.t('key')` 标记。

## 🔗 相关链接

- [Ray 官方文档](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview?source=platform)
