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
                <p class="pa-2 white--text red" v-for="(error, i) in errors" :key="i">{{ error }}</p>
                <v-btn
                color="primary"
                elevation="2"
                large
                @click.prevent="loginAdmin"
                >Войти</v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')

export default {
    components: {},
    data() {
        return {
            login: "",
            password: "",
            errors: [],
        }
    },
    methods: {
        async loginAdmin() {
            const response = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    login: this.login,
                    password: this.password
                })
            })
            const result = await response.json()
            if(result.ok) {
                this.$store.commit('admins/authenticate', {tokens: result.tokens, admin_id: result.admin_id})
                this.$router.push({path: `/admin/`})
            } else {
                this.errors.push(result.error.msg)
            }
        },
    },
    watch: {
        errors() {
            setTimeout(() => {
                this.errors = []
            }, 4000)
        }
    },
    beforeMount() {
        this.$store.commit('admins/syncState')
        if (this.$store.getters['admins/getIsAuth']) {
            this.$router.push({path: `/admin/`})
        }
    },
    beforeDestroy() {
        this.$store.commit('admins/saveState')
    }
}
</script>

<style scoped>

</style>