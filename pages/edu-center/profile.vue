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
export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            id: "",
            title: "",
            contact_person: "",
            phone: "",
            email: "",
            password: "",
            site_url: "",
            requisites: "",
            add_notes: ""
        }
    },
    beforeMount() {
        this.$store.commit('eduCenter/syncState')
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>