const path = require('path')
function resolve(dir) {
 return path.join(__dirname, '.', dir)
}
module.exports = {
    // 基本路径
    publicPath: '/',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    // chainWebpack: () => {},
    chainWebpack: config => {
        // 一个规则里的 基础Loader
        // svg是个基础loader
        // const svgRule = config.module.rule('svg')
        
        // // 清除已有的所有 loader。
        // // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        // svgRule.uses.clear()
        // // 添加要替换的 loader
        // svgRule
        // .use('svg-sprite-loader')
        // .loader('svg-sprite-loader')
        // .options({
        //   symbolId: 'icon-[name]'
        // })  
        config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
        //const svgRule = config.module.rule('svg')
        //svgRule.uses.clear()
        config.module
         .rule('svg-sprite-loader')
         .test(/\.svg$/)
         .include
         .add(resolve('src/icons/svg')) //处理svg目录
         .end()
         .use('svg-sprite-loader')
         .loader('svg-sprite-loader')
         .options({
          symbolId: 'icon-[name]'
         })
            
    },
    configureWebpack: () => {},
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置
    css: {
     // 是否使用css分离插件 ExtractTextPlugin
     extract: true,
     // 开启 CSS source maps?
     sourceMap: false,
     // css预设器配置项
     loaderOptions: {},
     // 启用 CSS modules for all css / pre-processor files.
     modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
     open: process.platform === 'darwin',
     host: 'localhost',
     port: 8080,
     https: false,
     hotOnly: false,  
     proxy: { 
         '/api': {//虚拟目录
          target: 'http://127.0.0.1:8888',
        //   target: 'http://liuzhaoyu667.com:8888',
          changeOrigin: true,
          pathRewrite: {
              '^/api': ''
          }
      }
     }, // 设置代理
     before: app => {}
    },
  
    // 第三方插件22配置
    pluginOptions: {
     // ...
    }
   }