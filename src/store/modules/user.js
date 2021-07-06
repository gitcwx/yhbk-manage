import axios from 'axios'
import { api } from '@/api'

const user = {
    state: {
        token: '',
        info: null
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USER_INFO: (state, info) => {
            state.info = info
        }
    },
    actions: {
        GetUserInfo ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios({
                    url: api.user.info,
                    method: 'post'
                }).then(res => {
                    if (!res.data) {
                        reject(
                            new Error('/user/info request error')
                        )
                    }
                    if (res.data.statusCode === '00') {
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
