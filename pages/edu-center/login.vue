<template>
    <v-row>
        <v-col
        cols="12"
        sm="4"
        offset-sm="4"
        >
            <v-form
                ref="form"
                lazy-validation
                class="pt-16"
            >
                <h2 class="pb-5 text-center">Авторизация</h2>
                <v-text-field
                v-model="login"
                label="Логин"
                required
                ></v-text-field>

                <v-text-field
                v-model="password"
                type="password"
                label="Пароль"
                required
                ></v-text-field>
                <p class="pa-2 white--text red" v-for="error in errors" :key="error">{{ error }}</p>
                <v-btn
                color="primary"
                elevation="2"
                large
                @click.prevent="loginEdu"
                >Войти</v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: 'default',
    data() {
        return {
            login: "",
            password: "",
            errors: [],
        }
    },
    methods: {
        async loginEdu() {
            const response = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    login: this.login,
                    password: this.password
                })
            })
            const data = await response.json()
            if (data.ok) {
                this.$store.commit('eduCenter/authenticate', {educational_center_id: data.educational_center_id, tokens: data.tokens})
                this.$router.push({path: `/edu-center/profile`})
            } else {
                this.errors.push("Введены неккоректные данные")
            }
        },
    },
    beforeMount() {
        this.$store.commit('eduCenter/syncState')
        if (this.$store.getters['eduCenter/getIsAuth']) {
            this.$router.push({path: `/edu-center/profile`})
        }
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>