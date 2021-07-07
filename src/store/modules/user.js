import axios from 'axios'
import { api } from '@/api'

const user = {
    state: {
        token: '',
        permission: [],
        info: {},
        msgCount: 0
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
        },
        SET_MSGCOUNT: (state, count) => {
            state.msgCount = count
        }
    },
    actions: {
        getPermission ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios.post('/api/user/getPermission').then(res => {
                    if (res.data && res.data.code === 200) {
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
                axios({
                    url: api.user.info,
                    method: 'post'
                }).then(res => {
                    if (res.data && res.data.code === 200) {
                        commit('SET_USER_INFO', res.data.data)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getMsgCount ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios.post('/api/message/count').then(res => {
                    if (res.data && res.data.code === 200) {
                        commit('SET_MSGCOUNT', res.data.data)
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
