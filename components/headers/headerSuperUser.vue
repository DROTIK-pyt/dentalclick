<template>
    <header class="d-flex align-center pb-10">
        <v-row>
            <v-col class="left" cols="12" sm="3">
                <nuxt-link to="/dentalclik-dashboard">
                    <v-img
                    :src="require('~/assets/images/dentalclick.png')"
                    width="190"
                    height="70"
                    contain
                    ></v-img>
                </nuxt-link>
            </v-col>
            <v-col class="right d-flex justify-space-between align-center" cols="12" sm="8" offset-sm="1" tag="ul">
                <nuxt-link class="header-link text-h6" :to="toUrl('admins')">Админы</nuxt-link>
                <nuxt-link class="header-link text-h6" :to="toUrl('centers')">Обр. центры</nuxt-link>
                <nuxt-link class="header-link text-h6" :to="toUrl('curses')">Курсы</nuxt-link>
                <nuxt-link class="header-link text-h6" :to="toUrl('doctors')">Докторы</nuxt-link>
                <nuxt-link class="header-link text-h6" :to="toUrl('moderation')">Модерация</nuxt-link>
                <v-btn
                tile
                color="error"
                @click.prevent="superUserLogout"
                >
                <v-icon left>
                    mdi-exit-to-app
                </v-icon>
                Выйти
                </v-btn>
            </v-col>
        </v-row>
    </header>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')

export default {
    name: "headerSuperUser",
    data() {
        return {

        }
    },
    methods: {
        toUrl(url) {
            return `/dentalclik-dashboard/${url}`
        },
        async superUserLogout() {
            this.$store.commit('superuser/logout')
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/logout`)
            this.$store.commit('superuser/saveState')
            this.$router.push({path: "/dentalclik-dashboard/login"})
        },
    }
}
</script>

<style scoped>
.header-link {
    color: #000;
    text-decoration: none;
}
</style>