/*
 * @Descripttion: webpack配置
 * @Author: 
 * @Date: 2020-04-03 14:45:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-28 18:19:37
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isProd = process.env.NODE_ENV === 'prod';
const config = require('./public/config')
const path = require('path');
module.exports = {
  // 多入口配置
  entry: {
    main: './src/index.js',
    mainApp: './src/index.multi.js'
  },
  mode: isProd ? 'production' : 'development',
  // 开发环境
  devServer: {
    port: 3000,
    quiet: false,
    hot: true,
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true //是否启用 gzip 压缩
  },
  devtool: 'cheap-module-eval-source-map', //开发环境下使用
  // entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][hash:12].js',
    publicPath: '/' //通常是cdn
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'main.html',
      hash: true,
      // 判断加载模板
      config: isProd ? config.prod.template : config.dev.template,
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false
      },
      //  用于指定需要引入到html中的js文件

      chunks: ['main']
      // hash: true //是否加上hash，默认是 false
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'mainApp.html',
      //是否加上hash，默认是 false

      hash: true,

      // 判断加载模板
      config: isProd ? config.prod.template : config.dev.template,
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false
      },
      //  用于指定需要引入到html中的js文件
      chunks: ['mainApp']
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      //  .babelrc配置
      //   {
      //     "presets": ["@babel/preset-env"],
      //     "plugins": [
      //         [
      //             "@babel/plugin-transform-runtime",
      //             {
      //                 "corejs": 3
      //             }
      //         ]
      //     ]
      // }
      // babel-loader配置
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  "corejs": 3
                }
              ]
            ]
          }
        },
        exclude: /node_modules/ //排除 node_modules 目录
      }, {
        test: /\.(le|c)ss$/,
        // style-loader 动态创建 style 标签，将 css 插入到 head 中.
        // css-loader 负责处理 @import 等语句。
        // postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀
        // less-loader 负责处理编译 .less 文件,将其转为 css
        // loader 的执行顺序是从右向左执行的，也就是后面的 loader 先执行，
        // 上面 loader 的执行顺序为: less - loader-- -> postcss - loader-- -> css - loader-- -> style - loader
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('autoprefixer')({
                  "overrideBrowerslist": [
                    ">0.25%",
                    "not dead"
                  ]
                })
              ]
            }
          }
        }, 'less-loader'],
        exclude: /node_modules/
      },
      // 图片文件处理
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240, //资源大小小于 10K 时，将资源转换为 base64 超过 10K，将图片拷贝到 dist 目录
            esModule: false, //img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
            name: '[name]_[hash:6].[ext]',
            outputPath: 'img'
          }
        }]
      },
      // {
      //   test: /.html$/,
      //   use: 'html-withimg-loader'
      // }
    ],


  }
}