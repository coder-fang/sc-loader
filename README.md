# sc-loader
实现一个简单的webpack loader

## 为什么需要 loader？

由于 Webpack 只能处理 js 和 JSON 文件，不能处理 css 文件或图片，需要 loader 处理其他类型的文件并将它们转换为有效的模块以供应用程序使用并添加到依赖关系图中。

## loader 是什么？

本质上是一个 node 模块，符合 webpack 中一切皆模块的思想。
由于它是一个 node 模块，必须导出一些东西。loader 是一个函数，在该函数中对接收到的内容进行转换，然后返回转换后的结果。

## 常见的 loader 有哪些

### css-loader 和 style-loader

安装依赖：npm i css-loader style-loader
使用 loader：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

> `module.rules` 代表模块的处理规则，每个规则可以包含很多配置项。<br>test：可以接收正则表达式或元素为正则表达式的数组。只有与正则表达式匹配的模块才会使用该规则。如 `/\.css$/` 匹配所有以`.css` 结尾的文件。<br>use：可以接收一个包含规则使用的加载器的数组。 如果只配置了一个 loader，也可以为字符串。<br>css-loader 作用：只是处理 css 的各种加载语法，如果样式要工作，则需要 style-loader 将样式插入页面。<br>style-loader 加到 css-loader 前面，是因为在 webpack 打包时是按照数组从后往前的顺序将资源交给 loader 处理的，因此要把最后生效的放在前面。

当然也可以写成对象的形式，里面 options 传入配置。

> exclude 与 include

- include 代表该规则只对匹配到的模块生效
- exclude 含义是：所有被正则匹配到的模块都排除在该规则之外。

### babel-loader

把高级语法转为 ES5，常用于处理 ES6+并将其编译为 ES5。允许我们在项目中使用最新的语言特性，而无需特别注意这些特性在不同平台上的兼容性。

- babel-loader：使 Babel 与 Webpack 一起工作的模块。
- @babel/core：Babel 核心模块。
- @babel/preset-env：是 Babel 官方推荐的 preseter，可以根据用户设置的目标环境，自动添加编译 ES6+代码所需的插件和补丁。

安装：npm i babel-loader @babel/core @babel/preset-env
配置：

```js
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/, //排除掉，不排除拖慢打包的速度
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true, // 启用缓存机制以防止在重新打包未更改的模块时进行二次编译
        presets: [[
          'env', {
            modules: false, // 将ES6 Module的语法交给Webpack本身处理
          }
        ]],
      },
    },
  }
],
```

### html-loader

Webpack 不认识 html，直接报错，需要 loader 转化。
html-loader 用于将 html 文件转换为字符串并进行格式化，它允许我们通过 JS 加载一个 HTML 片段。

安装：npm i html-loader

配置：

```js
rules: [
  {
    test: /\.html$/,
    use: "html-loader",
  },
];
```

```js
// index.js
import otherHtml from "./other.html";
document.write(otherHtml);
```

这样可以在 js 中加载另一个页面，写到当前 index.html 里面。

### file-loader

用于打包文件类型的资源，例如对 png、jpg、gif 等图片资源使用 file-loader，然后就可以在 js 中加载图片了。

安装：npm i file-loader

配置：

```js
const path = require("path");
module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: "file-loader",
      },
    ],
  },
};
```

### url-loader

与 file-loader 唯一的区别是：用户可以设置文件大小阈值。
大于阈值时返回与 file-loader 相同的 publicPath，小于阈值时返回文件 base64 编码。

安装：npm i url-loader

配置：

```js
rules: [
    {
        test: /\.(png|jpg|gif)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 1024,
                name: '[name].[ext]',
                publicPath: './assets/',
            },
        },
    }
],
```

### ts-loader

类似于 babel-loader，是一个连接 webpack 与 typescript 的模块。

安装：npm i ts-loader typescript

配置：
tsconfig.jsonz 中：

```js
rules: [
    {
        test: /\.ts$/,
        use: 'ts-loader',
    }
],
```

### vue-loader

用来处理 vue 组件，安装 vue-template-compiler 来编译 vue 模板。

安装：npm i vue-loader vue-template-compiler

配置；

```js
rules: [
    {
        test: /\.vue$/,
        use: 'vue-loader',
    }
],
```

## 如何写一个简单的 loader

### 初始化项目

先创建一个项目文件夹`sc-loader` 后进行初始化。

初始化：npm init 0-y

安装依赖；`npm install webpack@4.39.2 webpack-cli@3.3.6 webpack-dev-server@3.11.0 -D`

新建一个 index.html 文件

src/index.html

```js
document.write("hello world");
```

创建 webpack.config.js 配置文件

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    overlay: {
      warnings: true,
      errors: true,
    },
    open: true,
  },
};
```

package.json 中配置启动命令：

```js
"scripts": {
    "dev": "Webpack-dev-server"
},
```

启动`npm run dev`

devServer 帮我们启动一个服务器，每次修改 index.js 不需要我们自己去打包，而是自动帮我们完成这项任务。

页面内容是 index.js 的内容被打包在 dist/bundle.js 引入到 index.html 里了。

### 实现一个简单的 loader

src/MyLoader/my-loader.js

```js
module.exports = function (source, sourceMap) {
  this.callback(null, source.replace("word", ", I am Xiaolang"), sourceMaps);
};
```

加载本地 loader 的方式：

1. 使用 path.resolve：

```js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: path.resolve("./src/myLoader/my-loader.js"),
      },
    ],
  },
};
```

2. ResolveLoader
   先去 node_modules 下找 my-loader，如果找不到，会去`./src/myLoader`下找。

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["my-loader"],
      },
    ],
  },
  resolveLoader: {
    modules: ["node_modules", "./src/myLoader"],
  },
};
```

> 一个 loader 的职责是单一的，使每个 loader 易维护。

如果源文件需要分多步转换才能正常使用，通过多个 loader 进行转换。当调用多个 loader 进行文件转换时，每个 loader 都会链式执行。

第一个 loader 会得到要处理的原始内容，将前一个 loader 处理的结果传递给下一个。处理完后，最终的 loader 会将处理后的最终结果返回给 webpack。

因此，我们在编写 loader 时要保证其职责单一，只需关心输入与输出。

### option 配置信息

```js
use: [{
    loader: "./src/myLoader/my-loader.js",
    options: {
        flag: true,
    },
}, ],
```

在 loader 中获取这个写入配置信息：

可以使用 webpack 提供的 loader-utils 工具。

在 loader 中修改：

```js
const loaderUtils = require("loader-utils");
module.exports = function (source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  console.log("options-->", options);
};
```

### 缓存

如果为每个构建重新执行重复的转换操作，webpack 构建可能会变得非常慢。

webpack 默认会缓存所有的 loader 处理结果，即当待处理的文件或依赖没有变化时，不会再次调用对应的 loader 进行转换操作。

```js
module.exports = function (source) {
  // 开始缓存
  this.cacheable && this.cacheable();
  // 在这里按照你的需求处理 source
  return source.replace("word", ", I am sc");
};
```

一般开启默认缓存，如果不想 webpack 这个 loader 进行缓存，也可以关闭缓存。

```js
module.exports = function (source) {
  // 关闭缓存
  this.cacheable(false);
  // 在这里按照你的需求处理 source
  return source.replace("word", ", I am sc");
};
```

### 同步与异步

某些情况下，转换步骤只能异步进行。

例如，需要发出网络请求以获取结果。如果使用同步方式，网络请求会阻塞整个构建，导致构建十分缓慢。

```js
module.exports = function (source) {
  // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
  var callback = this.async();
  // someAsyncOperation 代表一些异步的方法
  someAsyncOperation(source, function (err, result, sourceMaps, ast) {
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast);
  });
};
```

### 处理二进制数据

默认情况下，webpack 传递给 loader 的原始内容是一个 UTF-8 格式编码的字符串。但是在某些场景下，加载器处理的不是文本文件，而是二进制文件。

```js
module.exports = function (source) {
  // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
  source instanceof Buffer === true;
  // Loader 返回的类型也可以是 Buffer 类型的
  // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
  return source;
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据
module.exports.raw = true;
```

### 实现一个渲染 markdown 文档 loader

安装 md 转 html 的依赖。

> npm i markdown-it@12.0.6 -D

新建一个 loader

/src/MyLoader/md-loader.js

```js
const { getOptions } = require("loader-utils");
const MarkdownIt = require("markdown-it");
const beautify = require("./beautify");

module.exports = function (source) {
  const options = getOptions(this) || {};
  const md = new MarkdownIt({
    html: true,
    ...options,
  });
  let html = beautify(md.render(source));
  html = `module.exports = ${JSON.stringify(html)}`;
  this.callback(null, html);
};
```

在 webpack.config.js 使用这个加载器：

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    overlay: {
      warnings: true,
      errors: true,
    },
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // use: path.resolve("./src/myLoader/my-loader.js"),
        use: [
          {
            loader: "my-loader.js",
            options: {
              flag: true,
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "md-loader",
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: ["node_modules", "./src/myLoader"],
  },
};
```

使用；
在 index.js 中加载一个 md 文件

```js
document.write("hello word");

import mdHtml from "./test.md";
const content = document.createElement("div");
content.className = "content";
content.innerHTML = mdHtml;
document.body.appendChild(content);
```

beautify.js

```js
module.exports = function ModifyStructure(html) {
  // 把h3和h2开头的切成数组
  const htmlList = html
    .replace(/<h3/g, "$*(<h3")
    .replace(/<h2/g, "$*(<h2")
    .split("$*(");

  // 给他们套上 .card 类名的 div
  return htmlList
    .map((item) => {
      if (item.indexOf("<h3") !== -1) {
        return `<div class="card card-3">${item}</div>`;
      } else if (item.indexOf("<h2") !== -1) {
        return `<div class="card card-2">${item}</div>`;
      }
      return item;
    })
    .join("");
};
```

效果：
![](https://cdn.jsdelivr.net/gh/coder-fang/myBlogImgRespository/img/1672747018651_52C3B74A-1F54-4c5c-A4A9-E23DDBE1812C.png)

[**github 地址**](https://github.com/coder-fang/sc-loader)
