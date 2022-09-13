<template>
    <v-row>
        <v-col
        cols="12"
        sm4
        >
        <h1>profile page</h1>
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: "ProfileDoc",

    components: {

    },
    data() {
        return {
            id: this.$store.getters['doctors/getId'],
            name: "",
            phone: "",
            email: "",
            region: "",
            specialization: "",
        }
    },
    methods: {
        async checkAuth() {
            if(this.$store.getters['doctors/getTokens'].refresh) {
                const refresh = this.$store.getters['doctors/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['doctors/getTokens'].access.split('.')[1]))

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                            doctor_id: this.$store.getters['doctors/getId'],
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        this.$store.commit('doctors/authenticate', {
                            doctor_id: this.$store.getters['doctors/getId'],
                            tokens: responsed.tokens
                        })
                    } else {
                        this.$store.commit('doctors/logout')
                        this.$router.push({path: `/doctor/login`})
                    }
                }
            }
        },
        async getAllData() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/info`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['doctors/getTokens'].access
                },
                body: JSON.stringify({
                    doctor_id: this.id,
                })
            })
            
            const responsed = await result.json()
            
            this.name = responsed.info.name
            this.phone = responsed.info.phone
            this.email = responsed.info.email
            this.region = responsed.info.region
            this.specialization = responsed.info.specialization
        }
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('doctors/syncState')
        if (!this.$store.getters['doctors/getIsAuth']) {
            this.$router.push({path: `/doctor/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('doctors/saveState')
    }
}
</script>

<style scoped>

</style>