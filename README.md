# 大屏数据可视化 📊🖥️

这是一个用于展示实时数据和统计信息的大屏数据可视化应用。项目采用 Vue3 构建前端架构，利用 Echarts5 绘制图表和数据可视化效果，并通过 Sass 进行样式预处理。动画效果由 GSAP 提供支持，vue-seamless-scroll 插件用于实现数据的无缝滚动展示。

## 特点 🌟

- **大屏适配**📐：设计与实现了响应式布局，确保可视化在不同尺寸的大屏上均可良好展示。
- **动画效果**💫：使用 GSAP (GreenSock Animation Platform) 为数据变化提供平滑的动画效果。
- **无缝滚动**🔄：采用 vue-seamless-scroll 插件实现数据的连续滚动显示。

## 安装指南 📦

要在本地安装和运行此项目，请按照以下步骤操作：

### 环境设置 🛠️

首先确保您已经安装了 `node.js` 和 `npm`。然后克隆仓库到本地：

```bash
git clone https://github.com/Cicici-Shi/monitor-screen.git
```

### 依赖安装 📥

安装项目所需的依赖：

```bash
npm install
```

### 开发模式运行 🚀

为了在开发模式下运行应用，并启动热重载功能：

```bash
npm run serve
```

### 构建生产环境 🏗️

为了编译和压缩生产环境的应用：

```bash
npm run build
```

### Lint 和修复文件 🔍

运行 lint 并自动修复源代码中的问题：

```bash
npm run lint
```

## 配置 🔧

如果需要自定义配置，请参阅 [配置参考](https://cli.vuejs.org/config/).

## 贡献 👥

我们欢迎任何形式的贡献。如果你想要贡献代码，请:

1. Fork 仓库。
2. 创建一个新的分支 (`git checkout -b feature-xyz`).
3. 提交你的修改 (`git commit -am 'Add some feature'`).
4. 推送到分支 (`git push origin feature-xyz`).
5. 创建一个新的 Pull Request。

## 许可 📄

[MIT](LICENSE)
