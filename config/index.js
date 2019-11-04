'use strict'
// Template version: 1.1.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8081,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/chain-web': { // 当前项目的代理
            target: 'http://10.200.131.93:8083',
            // target: 'http://192.168.2.147:8083', // 蒋一鸣本地
            // target: 'http://192.168.2.143:8083', // 罗兴成本地
            // target: 'http://192.168.2.143:8083', // 王洁本地
            // target: 'http://192.168.2.141:8083', // 沈振宇本地
            changeOrigin: true,
            pathRewrite: {
                '^/chain-web': '' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
            }
        },
        // '/phone' : {   //登录的代理
        //       target: 'http://ucenter.trc.com/gateway/foundation-user/login/phone_code',
        //       changeOrigin: true,
        //   },
      '/phone_pwd_code' : {   //登录的代理
            target: 'http://ucenter.fengdai.org/gateway/foundation-user/login',
            changeOrigin: true,
        },
      '/gateway' : {   //登录的代理
            target: 'http://ucenter.fengdai.org/',
            changeOrigin: true,
        },
      '/scm-web': {
        target: 'http://dev-scm.fengdai.org',
        changeOrigin: true,
        // pathRewrite: {
        //     '^/scm-web': '/scm-web'
        // }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
