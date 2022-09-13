import Vue from "vue"
const baseSettings = require('../server/config/serverSetting')

export const state = () => ({
    profile: {
        isAuth: false,
        tokens: {
            accessToken: null,
            refresh: null,
        },
        doctor_id: null,
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
        return state.profile.doctor_id
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
        state.profile.doctor_id = data.doctor_id
    },
    logout(state) {
        state.profile.isAuth = false
        state.profile.tokens.access = null
        state.profile.tokens.refresh = null
        state.profile.doctor_id = null
    },
    saveState(state) {
        localStorage.setItem('vuex-doc', JSON.stringify(state))
    },
    syncState(state) {
        if (localStorage.getItem('vuex-doc')) {
            Vue.set(state, 'profile', JSON.parse(localStorage.getItem('vuex-doc')).profile)
        }
    }
}