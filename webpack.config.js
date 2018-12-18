const path = require('path')
const webpack = require('webpack')
const extractTextPlugin = require('extract-text-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

// 获取环境变量值
const nodeEnv = process.env.NODE_ENV
// 处理 postcss 样式
const postcssConfig = require('./postcss.config.js')
// 处理 HTML 模板
const getHtmlTemplate = function(name) {
  return {
    template: './src/view/' + name + '.html',
    filename: name + '.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true, // 关闭空格
      removeComments: true, // 移除注释
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      removeAttributeQuotes: true // 移除属性双引号
    },
    chunks: ['vendor', 'common', name]
  }
}

// 主配置
const config = {
  // 入口文件
  entry: {
    index: './src/page/index/index.js',
    login: './src/page/login/index.js'
  },
  // 打包文件
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, './dist')
  },
  // 外部引入 CDN 打包排除依赖
  externals: {
    jquery: 'jQuery'
  },
  // 创建 import 或 require 的别名
  resolve: {
    alias: {
      helpers: path.resolve(__dirname, './src/helpers'),
      view: path.resolve(__dirname, './src/view'),
      page: path.resolve(__dirname, './src/page'),
      images: path.resolve(__dirname, './src/images')
    }
  },
  module: {
    rules: [
      // 处理图片
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: './img/[name]_[hash:8].[ext]'
          }
        }],
        include: path.resolve(__dirname, './src')
      },
      // 处理文件
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: 'file-loader',
        include: path.resolve(__dirname, './src')
      },
      // JS 文件兼容处理
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.resolve(__dirname, './src')
      }
      // 处理 HTML 与 HTML-WEBPACK-PLUGIN 冲突
      // {
      //   test: /\.html$/,
      //   use: {
      //     loader: 'html-loader?minimize=true'
      //   },
      //   include: path.resolve(__dirname, './src')
      // }
    ]
  },
  plugins: [
    new htmlWebpackPlugin(getHtmlTemplate('index')),
    new htmlWebpackPlugin(getHtmlTemplate('login'))
  ]
}

// 开发测试
if (nodeEnv === 'development') {
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: postcssConfig(nodeEnv)
        }
      }
    ],
    include: path.resolve(__dirname, './src')
  })

  config.plugins.push(new webpack.NamedModulesPlugin())

  config.devServer = {
    // 刷新页面无 404
    // historyApiFallback: {
    //   index: `${PUBLICPATH}index.html`
    // },
    port: 3000,
    host: 'localhost',
    proxy: {
      '/': {
        target: 'http://happymmall.com/',
        secure: false,
        changeOrigin: true
      }
    }
  }

  config.plugins.devtool = 'cheap-module-eval-source-map'
}

// 发布打包
if (nodeEnv === 'production') {
  config.module.rules.push({
    test: /\.css$/,
    use: extractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: postcssConfig(nodeEnv)
          }
        }
      ]
    }),
    include: path.resolve(__dirname, './src')
  })

  config.plugins.push(new extractTextPlugin({
    filename: './css/[name].css'
  }))

  config.optimization = {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        // 打包 NODE_MODULES 模块
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true
        },
        // 引用超过一次的模块抽取出来
        common: {
          name: 'common',
          chunks: 'all',
          priority: 2,
          minChunks: 2,
          enforce: true
        }
      }
    }
  }

  config.devtool = 'cheap-module-source-map'
}

module.exports = config