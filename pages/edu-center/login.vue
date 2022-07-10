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
                label="Пароль"
                required
                ></v-text-field>
                <v-btn
                text
                color="error"
                class="text-caption text-right"
                >
                    Нужна помощь?
                </v-btn>
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

export default {
    layout: 'eduLogin',
    data() {
        return {
            login: "",
            password: "",
        }
    },
    methods: {
        async loginEdu() {
            const response = await fetch("http://localhost:8888/edu/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: this.login,
                    password: this.password
                })
            })
            const data = await response.json()
            if (data.ok) {
                this.$store.commit('eduCenter/authenticate', data)
                this.$router.push({path: `/edu-center/profile`})
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