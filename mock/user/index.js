export default Mock => {
    Mock.mock(/\/api\/user\/info/, 'post', options => {
        return {
            code: 200,
            msg: '查询用户信息成功',
            data: {
                id: '000000',
                userId: '000000',
                name: '管理员',
                avatar: '',
                token: '000000'
            }
        }
    })

    Mock.mock(/\/api\/user\/getPermission/, 'post', options => {
        return {
            code: 200,
            msg: '查询成功',
            data: [
            ]
        }
    })

    Mock.mock(/\/api\/user\/login/, 'post', options => {
        return {
            code: 200,
            msg: '登录成功',
            data: 'ed9ab8972a1274528de023ba231553'
        }
    })
}
