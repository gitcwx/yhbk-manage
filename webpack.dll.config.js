const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// dll文件存放的目录
const dllPath = 'public/vendor'

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    entry: {
        // 需要提取的库文件
        vendor: [
            'axios',
            'core-js',
            'js-cookie',
            'mockjs',
            'moment',
            'nprogress',
            'qrcode',
            'register-service-worker',
            'vue',
            'vue-i18n',
            'vue-router',
            'vuex'
        ]
    },
    output: {
        path: path.join(__dirname, dllPath),
        filename: '[name].dll.js',
        // vendor.dll.js中暴露出的全局变量名
        // 保持与 webpack.DllPlugin 中名称一致
        library: '[name]_[hash]'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    resolve('node_modules/axios'),
                    resolve('node_modules/core-js'),
                    resolve('node_modules/js-cookie'),
                    resolve('node_modules/mockjs'),
                    resolve('node_modules/moment'),
                    resolve('node_modules/nprogress'),
                    resolve('node_modules/qrcode'),
                    resolve('node_modules/register-service-worker'),
                    resolve('node_modules/vue'),
                    resolve('node_modules/vue-i18n'),
                    resolve('node_modules/vue-router'),
                    resolve('node_modules/vuex')
                ]
            }
        ]
    },
    // devtool: 'eval',
    plugins: [
        // 清除之前的dll文件
        new CleanWebpackPlugin(['*.*'], {
            root: path.join(__dirname, dllPath)
        }),
        // 设置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        // manifest.json 描述动态链接库包含了哪些内容
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.resolve(__dirname, dllPath, '[name].manifest.json')
        })
    ]
}
