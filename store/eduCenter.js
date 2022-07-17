import Vue from "vue"

export const state = () => ({
    profile: {
        isAuth: true,
        tokens: {
            access: null,
            refresh: null,
            expires: 0
        },
        id: 1,
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
        return state.profile.id
    }
}

export const actions = {
    authenticate({commit}, data) {
        commit('authenticate', data)
    }
}

export const mutations = {
    authenticate(state, data) {
        if (data.ok) {
            state.profile.tokens = data.tokens
            state.profile.isAuth = true
            state.profile.id = data.id
        }
    },
    logout(state) {
        state.profile.isAuth = false
        state.profile.tokens.access = null
        state.profile.tokens.refresh = null
        state.profile.tokens.expires = 0
        state.profile.id = 0
    },
    saveState(state) {
        localStorage.setItem('vuex', JSON.stringify(state.profile))
    },
    syncState(state) {
        if (localStorage.getItem('vuex')) {
            Vue.set(state, 'profile', JSON.parse(localStorage.getItem('vuex')))
        }
    }
}