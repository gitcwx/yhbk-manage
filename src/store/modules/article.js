import axios from 'axios'
import { api } from '@/api'

const article = {
    state: {
        tagList: [],
        categoryList: []
    },
    mutations: {
        SET_TAG_LIST (state, list) {
            state.tagList = list
        },
        SET_CATEGORY_LIST (state, list) {
            state.categoryList = list
        }
    },
    actions: {
        getTagList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios({
                    url: api.tag.list,
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data && res.data.code === 's00') {
                        commit('SET_TAG_LIST', res.data.data)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getCategoryList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios({
                    url: api.category.list,
                    method: 'post',
                    data: {}
                }).then(res => {
                    if (res.data && res.data.code === 's00') {
                        commit('SET_CATEGORY_LIST', res.data.data)
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

export default article
