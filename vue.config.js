const webpack = require('webpack')
// gzip压缩插件
// const CompressionWebpackPlugin = require('compression-webpack-plugin')

// const projectTitle = '悠荷步客后台管理系统'

module.exports = {
    // 根据环境配置项目名
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: 'dist',
    // 保存时是否eslint检查
    lintOnSave: true,
    productionSourceMap: true,
    devServer: {
        // host: '127.0.0.1',
        port: 9999,
        // https: false, // https:{type:Boolean}
        open: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://api.youhebuke.com',
                ws: true,
                changeOrigin: true,
                // logLevel: 'debug',
                pathRewrite: {
                    '/api': 'http://api.youhebuke.com/api'
                }
            }
        }
    },
    pages: {
        index: {
            entry: 'src/entry/index/main.js',
            template: 'public/index.html',
            title: '悠荷步客'
        },
        manage: {
            entry: 'src/entry/manage/main.js',
            template: 'public/index.html',
            title: '悠荷步客后台管理系统'
        }
    },
    css: {
        loaderOptions: {
            sass: {
                // 全局SCSS变量
                prependData: '@import "~@/assets/css/common.scss";'
            }
        }
    },
    // 配置babel-loader 转译 node_modules 里面的文件
    transpileDependencies: [],
    configureWebpack: config => {
        const plugins = []
        config.devtool = 'source-map'
        config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false

        // 配置打包文件git信息
        plugins.push(
            new webpack.BannerPlugin({
                banner: (() => {
                    try {
                        const execSync = require('child_process').execSync
                        return JSON.stringify({
                            'remote-origin-url':
                                '' + execSync('git remote get-url origin'),
                            branch: '' + execSync('git remote get-url origin'),
                            commithash: '' + execSync('git rev-parse HEAD')
                        })
                    } catch (e) {
                        return 'not a git repository'
                    }
                })()
            })
        )

        config.plugins = [...config.plugins, ...plugins]
    }
}
