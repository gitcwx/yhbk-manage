import Mock from 'mockjs'

import user from './user/index.js'
import admin from './admin/index.js'
import message from './message/index.js'
Mock.setup({
    timeout: 500
})

console.log('启动mock请求数据')
user(Mock)
admin(Mock)
message(Mock)
