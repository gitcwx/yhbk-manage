const list = JSON.stringify([
    { id: '1', title: '消息标题1', status: 1, createTime: '2020-02-02 15:00:00', detail: '消息详情' },
    { id: '2', title: '消息标题2', status: 2, createTime: '2020-02-02 15:00:00', detail: '消息详情消息详情消息详情消息详情' },
    { id: '3', title: '消息标题3', status: 1, createTime: '2020-02-02 15:00:00', detail: '消息详情消息详情消息详情消息详情' },
    { id: '4', title: '消息标题4', status: 1, createTime: '2020-02-02 15:00:00', detail: '消息详情消息详情消息详情消息详情' },
    { id: '5', title: '消息标题5', status: 1, createTime: '2020-02-02 15:00:00', detail: '消息详情消息详情消息详情消息详情' },
    { id: '6', title: '消息标题6', status: 2, createTime: '2020-02-02 15:00:00', detail: '消息详情消息详情消息详情消息详情' }
])

export default Mock => {
    Mock.mock(/\/api\/message\/count/, 'post', options => {
        const count = {
            all: 0,
            unread: 0,
            read: 0
        }
        JSON.parse(list).forEach(v => {
            switch (v.status) {
                case 1: count.unread++; break
                case 2: count.read++; break
            }
            count.all++
        })
        return {
            code: 200,
            msg: '查询消息数量成功',
            data: count
        }
    })

    Mock.mock(/\/api\/message\/changeStatus/, 'post', options => {
        const params = JSON.parse(options.body)
        const count = {
            all: 0,
            unread: 0,
            read: 0
        }
        const temp = JSON.parse(list)
        temp.forEach(v => {
            if (v.id === params.id) {
                v.status = params.status
            }
        })
        temp.forEach(v => {
            switch (v.status) {
                case 1: count.unread++; break
                case 2: count.read++; break
            }
            count.all++
        })
        return {
            code: 200,
            msg: '操作成功',
            data: count
        }
    })

    Mock.mock(/\/api\/message\/list/, 'post', options => {
        const params = JSON.parse(options.body)
        return {
            code: 200,
            msg: '查询消息列表成功',
            data: (function () {
                let temp = JSON.parse(list)
                if (params.keywords) {
                    temp = temp.filter(v => { return v.title.indexOf(params.keywords) > -1 })
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
                if (params.keywords) {
                    temp = temp.filter(v => { return v.title.indexOf(params.keywords) > -1 })
                }
                if (params.status) {
                    temp = temp.filter(v => { return v.status === params.status })
                }
                return temp.length
            })()
        }
    })
}
