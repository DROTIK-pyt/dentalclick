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
        </v-col>
    </div>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            id: this.$store.getters['eduCenter/getId'],
            title: "",
            contact_person: "",
            phone: "",
            email: "",
            site_url: "",
            requisites: "",
            add_notes: ""
        }
    },
    methods: {
        async sendToModerate() {
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
        }
    },
    async beforeMount() {
        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu/info`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                educational_center_id: this.id,
            })
        })
        const responsed = await result.json()

        this.id = responsed.info.educational_center_id
        this.title = responsed.info.title
        this.contact_person = responsed.info.contact_person
        this.phone = responsed.info.phone
        this.email = responsed.info.email
        this.site_url = responsed.info.site_url
        this.requisites = responsed.info.requisites
        this.add_notes = responsed.info.add_notes

        this.$store.commit('eduCenter/syncState')
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>