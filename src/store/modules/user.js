import axios from 'axios'
import { api } from '@/api'

const user = {
    state: {
        token: '',
        permission: [],
        info: {}
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_PERMISSION: (state, permission) => {
            state.permission = permission
        },
        SET_USER_INFO: (state, info) => {
            state.info = info
        }
    },
    actions: {
        getPermission ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios({
                    url: api.permission.list,
                    method: 'post',
                    data: {
                        by: 'userId',
                        limit: 999,
                        orderName: 'createdAt',
                        orderby: 'asc'
                    }
                }).then(res => {
                    if (res.data && res.data.code === 's00') {
                        commit('SET_PERMISSION', res.data.data)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getUserInfo ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios.post(api.user.info).then(res => {
                    if (res.data && res.data.code === 's00') {
                        commit('SET_USER_INFO', res.data.data)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user
