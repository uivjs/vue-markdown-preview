vue-simple-package
===

简单的 [`vue 3`](https://v3.vuejs.org/) 包开发工程实例模板。

### 目录结构

```shell
.
├── README.md
├── lerna.json
├── package.json
├── packages             # 放置包的目录
│   ├── base                # 📦 包 @vue-simple-package/base
│   │   ├── cjs             # 🔄 编译后的 cjs 目录
│   │   ├── esm             # 🔄 编译后的 esm 目录
│   │   ├── package.json
│   │   ├── src             # 包源码目录
│   │   └── tsconfig.json
│   └── simple              # 📦 包 @vue-simple-package/simple
├── tsconfig.json
└── website              # 🐝 包实例测试，网站
    ├── README.md
    ├── babel.config.js
    ├── package.json
    ├── public
    ├── src
    └── vue.config.js
```

### 开发

1. 安装

```shell
npm install
```

2. 安装包和实例中的依赖

```shell
npm run bootstrap
```

3. 编译包中代码

```shell
npm run build        # 编译所有包 📦 代码

npm run watch:simple # 实时编译 📦 @vue-simple-package/simple
npm run watch:base   # 实时编译 📦 @vue-simple-package/base
```

4. 启动 `website` 实例网站

```shell
npm run start
```

### License

Licensed under the MIT License.