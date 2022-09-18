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
                @click.prevent="loginSuperUser"
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
        async loginSuperUser() {
            const response = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/login`, {
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
                this.$store.commit('superuser/authenticate', {tokens: result.tokens})
                this.$router.push({path: `/dentalclik-dashboard/profile`})
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
        this.$store.commit('superuser/syncState')
        if (this.$store.getters['superuser/getIsAuth']) {
            this.$router.push({path: `/dentalclik-dashboard/profile`})
        }
    },
    beforeDestroy() {
        this.$store.commit('superuser/saveState')
    }
}
</script>

<style scoped>

</style>