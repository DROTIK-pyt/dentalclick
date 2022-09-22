<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <v-form>
                <h2 class="mb-8 mr-10 float-left">Основная информация</h2>
                <v-btn
                depressed
                color="primary"
                class="mb-2"
                :loading="loading"
                :disabled="loading"
                @click="sendToModerate"
                >
                Отправить на модерацию
                </v-btn>
                <br>
                <v-btn
                depressed
                color="error"
                small
                class="mb-5"
                @click="callChangeAccesses"
                >
                Запросить смену доступов
                </v-btn>
                <v-textarea
                name="input-7-1"
                filled
                label="Наименование учебного центра"
                auto-grow
                row-height="7"
                row="1"
                v-model="title"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Контактное лицо"
                auto-grow
                row-height="7"
                row="1"
                v-model="contact_person"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Контактный телефон"
                auto-grow
                row-height="7"
                row="1"
                v-model="phone"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Email"
                auto-grow
                row-height="7"
                row="1"
                v-model="email"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Ссылка на сайт"
                auto-grow
                row-height="7"
                row="1"
                v-model="site_url"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Реквизиты"
                auto-grow
                row-height="15"
                row="1"
                v-model="requisites"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Прочая информация"
                auto-grow
                row-height="20"
                row="1"
                v-model="add_notes"
                ></v-textarea>
            </v-form>
            <CompleteSended
               :isSended="isSended" 
            />
        </v-col>
    </div>
</template>

<script>
import CompleteSended from '@/components/centers/CompleteSended'

const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            id: this.$store.getters['eduCenter/getId'],
            loading: false,
            isSended: false,
            title: "",
            contact_person: "",
            phone: "",
            email: "",
            site_url: "",
            requisites: "",
            add_notes: ""
        }
    },
    components: {
        CompleteSended
    },
    methods: {
        async sendToModerate() {
            this.checkAuth()
            this.loading = true

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu/moderate`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    id: this.id,
                    title: this.title,
                    contact_person: this.contact_person,
                    phone: this.phone,
                    email: this.email,
                    site_url: this.site_url,
                    requisites: this.requisites,
                    add_notes: this.add_notes
                })
            })
            const responsed = await result.json()

            setTimeout(() => {
                this.loading = false
                this.isSended = true
            }, 500)
        },
        async callChangeAccesses() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/change-accesses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    educational_center_id: this.id,
                })
            })
            const responsed = await result.json()

            setTimeout(() => {
                this.isSended = true
            }, 500)
        },
        async checkAuth() {
            if(this.$store.getters['eduCenter/getTokens'].refresh) {
                const refresh = this.$store.getters['eduCenter/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['eduCenter/getTokens'].access.split('.')[1]))

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                            educational_center_id: this.$store.getters['eduCenter/getId'],
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        this.$store.commit('eduCenter/authenticate', {
                            educational_center_id: this.$store.getters['eduCenter/getId'],
                            tokens: responsed.tokens
                        })
                    } else {
                        this.$store.commit('eduCenter/logout')
                        this.$router.push({path: `/edu-center/login`})
                    }
                }
            }
        },
        async getAllData() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu/info`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['eduCenter/getTokens'].access
                },
                body: JSON.stringify({
                    educational_center_id: this.id,
                })
            })
            
            const responsed = await result.json()

            if(responsed.status === "blocked") {
                this.$router.push({path: "/edu-center/was-blocked"})
            }

            this.title = responsed.info.title
            this.contact_person = responsed.info.contact_person
            this.phone = responsed.info.phone
            this.email = responsed.info.email
            this.site_url = responsed.info.site_url
            this.requisites = responsed.info.requisites
            this.add_notes = responsed.info.add_notes
        }
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('eduCenter/syncState')
        if (!this.$store.getters['eduCenter/getIsAuth']) {
            this.$router.push({path: `/edu-center/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>