<template>
    <v-row>

    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: "ProfileAdmin",
    components: {},
    data() {
        return {

        }
    },
    methods: {
        async checkAuth() {
            if(this.$store.getters['admins/getTokens'].refresh) {
                const refresh = this.$store.getters['admins/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['admins/getTokens'].access.split('.')[1]))

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                            admin_id: this.$store.getters['admins/getId'],
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        console.log()
                        this.$store.commit('admins/authenticate', {
                            tokens: responsed.tokens
                        })
                        this.$store.commit('admins/saveState')
                    } else {
                        this.$store.commit('admins/logout')
                        this.$router.push({path: `/admin/login`})
                    }
                }
            }
        },
        async getAllData() {
            this.checkAuth()

        },
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('admins/syncState')
        if (!this.$store.getters['admins/getIsAuth']) {
            this.$router.push({path: `/admin/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('admins/saveState')
    }
}
</script>

<style scoped>

</style>