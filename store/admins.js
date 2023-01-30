import Vue from "vue"
const baseSettings = require('../server/config/serverSetting')

export const state = () => ({
    profile: {
        isAuth: false,
        tokens: {
            accessToken: null,
            refresh: null,
        },
        admin_id: null,
    }   
})

export const getters = {
    getIsAuth(state) {
        return state.profile.isAuth
    },
    getTokens(state) {
        return state.profile.tokens
    },
    getId(state) {
        return state.profile.admin_id
    }
}

export const actions = {
    authenticate({commit}, data) {
        commit('authenticate', data)
    }
}

export const mutations = {
    authenticate(state, data) {
        state.profile.tokens = data.tokens
        state.profile.isAuth = true
        state.profile.admin_id = data.admin_id
    },
    logout(state) {
        state.profile.isAuth = false
        state.profile.tokens.access = null
        state.profile.tokens.refresh = null
        state.profile.admin_id = null
    },
    saveState(state) {
        localStorage.setItem('vuex-admin', JSON.stringify(state))
    },
    syncState(state) {
        if (localStorage.getItem('vuex-admin')) {
            Vue.set(state, 'profile', JSON.parse(localStorage.getItem('vuex-admin')).profile)
        }
    }
}