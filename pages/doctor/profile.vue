<template>
    <v-row>
        <v-col
        cols="12"
        sm="9"
        >
        <v-btn
        class="ma-2"
        :loading="loadingProfile"
        :disabled="loadingProfile"
        color="success"
        @click="saveProfile"
        >
        Отправить на модерацию
        </v-btn>
        <v-btn
        class="ma-2"
        :loading="loadingAccesses"
        :disabled="loadingAccesses"
        color="error"
        @click="changeAccesses"
        >
        Запросить смену доступов
        </v-btn>
        <v-textarea
            label="ФИО"
            auto-grow
            rows="1"
            row-height="15"
            v-model="name"
        ></v-textarea>
        <v-textarea
            label="Телефон"
            auto-grow
            rows="1"
            row-height="15"
            v-model="phone"
        ></v-textarea>
        <v-textarea
            label="E-mail"
            auto-grow
            rows="1"
            row-height="15"
            v-model="email"
        ></v-textarea>
        <v-textarea
            label="Регион"
            auto-grow
            rows="1"
            row-height="22"
            v-model="region"
        ></v-textarea>
        <v-textarea
            label="Специализация(и)"
            auto-grow
            rows="1"
            row-height="30"
            v-model="specialization"
        ></v-textarea>
        <CompleteSended
            :isSended="isSended"
        />
        </v-col>
    </v-row>
</template>

<script>
import CompleteSended from '@/components/doctors/CompleteSended'

const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: "ProfileDoc",

    components: {
        CompleteSended
    },
    data() {
        return {
            id: this.$store.getters['doctors/getId'],
            loadingAccesses: false,
            loadingProfile: false,
            isSended: false,
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

            if(responsed.status === "blocked") {
                this.$router.push({path: "/doctor/was-blocked"})
            }
            
            this.name = responsed.info.name
            this.phone = responsed.info.phone
            this.email = responsed.info.email
            this.region = responsed.info.region
            this.specialization = responsed.info.specialization
        },
        async saveProfile() {
            this.loadingProfile = true

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/moderate`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['doctors/getTokens'].access
                },
                body: JSON.stringify({
                    doctor_id: this.id,
                    name: this.name,
                    phone: this.phone,
                    email: this.email,
                    region: this.region,
                    specialization: this.specialization,
                })
            })
            
            const responsed = await result.json()
            setTimeout(() => {
                this.loadingProfile = false
                this.isSended = true
            }, 500)
        },
        async changeAccesses() {
            this.loadingAccesses = true

            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/change-accesses`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['doctors/getTokens'].access
                },
                body: JSON.stringify({
                    doctor_id: this.id,
                })
            })

            setTimeout(() => {
                this.loadingAccesses = false
                this.isSended = true
            }, 500)
        },
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