const webpack = require('webpack')
// gzip压缩插件
const CompressionPlugin = require('compression-webpack-plugin')

const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

// element-plus 按需加载
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// const projectTitle = ''

module.exports = {
    // 根据环境配置项目名
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist',
    // 保存时是否eslint检查
    lintOnSave: true,
    productionSourceMap: true,
    devServer: {
        // host: '127.0.0.1',
        port: 9090,
        // https: false, // https:{type:Boolean}
        open: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://api.youhebuke.com',
                ws: true,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    },
    pages: {
        index: {
            entry: 'src/main.app.js',
            template: 'public/index.html',
            title: ''
        },
        manage: {
            entry: 'src/main.manage.js',
            template: 'public/index.html',
            title: '后台管理系统'
        }
    },
    css: {
        loaderOptions: {
            sass: {
                // 全局SCSS变量
                prependData: `
                    @use "~@/assets/css/variables.scss" as *;
                `
            }
        }
    },
    // 配置babel-loader 转译 node_modules 里面的文件
    transpileDependencies: [],
    configureWebpack: config => {
        const plugins = []
        if (process.env.NODE_ENV === 'production') {
            // 生成单独的souce-map文件，便于调试
            config.devtool = 'source-map'
            // 分离不常用第三方库，便于快速打包
            plugins.push(
                new webpack.DllReferencePlugin({
                    context: __dirname,
                    manifest: require('./public/vendor/vendor.manifest.json')
                })
            )
            // 入口html文件引入
            plugins.push(
                new HtmlWebpackIncludeAssetsPlugin({
                    assets: ['./vendor/vendor.dll.js'],
                    append: false
                })
            )
        }

        // GZIP压缩
        plugins.push(
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                threshold: 8192,
                minRatio: 0.8
            })
        )

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

        // element-plus 按需加载
        plugins.push(
            Components({
                resolvers: [ElementPlusResolver()]
            })
        )

        config.plugins = [...config.plugins, ...plugins]
    }
}
