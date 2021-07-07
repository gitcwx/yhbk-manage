const list = JSON.stringify([
    { id: 1, userId: '1', name: '张三疯', createTime: '2020-02-02 09:12:12', status: '1' },
    { id: 2, userId: '2', name: '张无极', createTime: '2020-02-02 09:12:12', status: '2' },
    { id: 3, userId: '3', name: '张无极2', createTime: '2020-02-02 09:12:12', status: '2' },
    { id: 4, userId: '4', name: '张无极3', createTime: '2020-02-02 09:12:12', status: '1' },
    { id: 5, userId: '5', name: '二狗子', createTime: '2020-02-02 08:10:22', status: '2' },
    { id: 6, userId: '6', name: '二狗子2', createTime: '2020-02-02 08:10:22', status: '1' }
])

export default Mock => {
    Mock.mock(/\/api\/admin\/adminList/, 'post', options => {
        const params = JSON.parse(options.body)

        return {
            code: 200,
            msg: '查询成功',
            data: (function () {
                let temp = JSON.parse(list)
                if (params.name) {
                    temp = temp.filter(v => { return v.name.indexOf(params.name) > -1 })
                }
                if (params.status) {
                    temp = temp.filter(v => { return v.status === params.status })
                }
                if (params.page) {
                    const limit = params.limit || 10
                    temp = temp.splice((params.page - 1) * limit, limit)
                }
                return temp
            })(),
            total: (function () {
                let temp = JSON.parse(list)
                if (params.name) {
                    temp = temp.filter(v => { return v.name.indexOf(params.name) > -1 })
                }
                if (params.status) {
                    temp = temp.filter(v => { return v.status === params.status })
                }
                return temp.length
            })()
        }
    })
}
