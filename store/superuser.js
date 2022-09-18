import Vue from "vue"
const baseSettings = require('../server/config/serverSetting')

export const state = () => ({
    profile: {
        isAuth: false,
        tokens: {
            access: null,
            refresh: null,
        },
    }   
})

export const getters = {
    getIsAuth(state) {
        return state.profile.isAuth
    },
    getTokens(state) {
        return state.profile.tokens
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
    },
    logout(state) {
        state.profile.isAuth = false
        state.profile.tokens.access = null
        state.profile.tokens.refresh = null
    },
    saveState(state) {
        localStorage.setItem('vuex-superUser', JSON.stringify(state))
    },
    syncState(state) {
        if (localStorage.getItem('vuex-superUser')) {
            Vue.set(state, 'profile', JSON.parse(localStorage.getItem('vuex-superUser')).profile)
        }
    }
}