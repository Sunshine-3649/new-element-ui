# vue基础模版

- a template of vue
  - 一个vue的基础模版
    - 封装了axios的方法。请求路径和方法分离,可随时查看更改接口路径
    - 路由模块化。路由嵌套，更清楚的知道页面之间的关系
    - 全局过滤器。列如：货币，时间...可以统一设置其规则
    - store模块化。每一个模块都有自己对应的状态管理，更便于管理数据状态。
    - page。页面级的
    - components。公共的组件和私有组件都可以写在这里。
    - eslint代码校验规范，团队协作必备，强化代码规范。

```
- 使用
  - web端可选择安装vux mint-ui...
    - 例: npm install mint-ui --save
    -     npm install
    -     npm run dev

  - pc端可选择安装element-ui iView...
    - 例: npm install element-ui --save
    -     npm install
    -     npm run dev
```

## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- node_modules                     // 项目依赖
	|-- src                              // 源码目录
	|   |-- api                          // 接口的方法和路径
	|   |-- assets                       // 静态资源（小）
	|   |-- components                   // 组件
	|   |-- filters                      // 过滤器
	|   |-- page                         // 主要路由页面
	|   |-- router 	                     // 主要路由
	|   |-- store 	                     // 状态管理
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- static                           // 静态资源文件夹（大）
	|-- .babelrc                         // ES6语法编译配置
	|-- .eslintrc                        // eslintrc代码校验配置
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明


## 运行及发布

``` bash
# 安装依赖
npm install

# 运行项目
npm run dev

# 项目打包
npm run build
```
