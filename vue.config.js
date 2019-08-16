/**
 * @param {string} baseUrl 公共路径
 * @param {string} outputDir 输出目录
 * @param {string} assetsDir 用于嵌套生成静态资产的目录
 * @param {string} productionSourceMap 是否构建map文件
 */
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const productionGzipExtensions = ['js', 'css'];
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  lintOnSave: process.env.NODE_ENV !== 'production',
  assetsDir: 'static',
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,
  devServer: {
    host: '0.0.0.0',
    port: 9000,
    proxy: {
      '/api': {
        target: 'https://house-map.cn/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
    overlay: {
      warnings: true,
      errors: true,
    }, // 浏览器 overlay 同时显示警告和错误：
  },
  chainWebpack: (config) => {
    // config.plugins.delete('preload'); // TODO: need test
    // config.plugins.delete('prefetch'); // TODO: need test
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@router', resolve(`src/router/${process.env.VUE_APP_VERSION || ''}`));
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_debugger: true,
              drop_console: true,
            },
            output: {
              comments: false,
            },
          },
          sourceMap: false,
          parallel: true,
        }),
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), // eslint-disable-line
          threshold: 10240,
          minRatio: 0.8,
        }),
        // new BundleAnalyzerPlugin(),
      );
    }
  },
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 是否在构建样式地图，false将提高构建速度
    loaderOptions: {
      // sass: {
      //   // 引入全局变量样式,@使我们设置的别名,执行src目录
      //   data: '@import "~@/assets/css/element-variables.scss";',
      // },
    }, // css预设器配置项
    modules: false, // 启用 CSS modules for all css / pre-processor files.
  },
};
