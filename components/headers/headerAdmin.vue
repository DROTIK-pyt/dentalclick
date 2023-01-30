<template>
    <header class="d-flex align-center pb-10">
        <v-row>
            <v-col class="left" cols="12" sm="3">
                <nuxt-link to="/admin/">
                    <v-img
                    :src="require('~/assets/images/dentalclick.png')"
                    width="190"
                    height="70"
                    contain
                    ></v-img>
                </nuxt-link>
            </v-col>
            <v-col class="right d-flex justify-space-between align-center" cols="12" sm="8" offset-sm="1" tag="ul">
                <nuxt-link class="header-link text-h6" v-if="showCenters" :to="toUrl('centers')">Обр. центры</nuxt-link>
                <nuxt-link class="header-link text-h6" v-if="showCurses" :to="toUrl('curses')">Курсы</nuxt-link>
                <nuxt-link class="header-link text-h6" v-if="showDocs" :to="toUrl('doctors')">Докторы</nuxt-link>
                <nuxt-link class="header-link text-h6" v-if="showModeration" :to="toUrl('moderation')">Модерация</nuxt-link>
                <v-btn
                tile
                color="error"
                @click.prevent="adminLogout"
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
            showCenters: false,
            showCurses: false,
            showDocs: false,
            showModeration: false,
        }
    },
    methods: {
        toUrl(url) {
            return `/admin/${url}`
        },
        async adminLogout() {
            this.$store.commit('admins/logout')
            this.$store.commit('admins/saveState')
            this.$router.push({path: "/admin/login"})
        },
    },
    async beforeMount() {
        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                admin_id: this.$store.getters['admins/getId']
            })
        })
        const {showCenters, showCurses, showDocs, showModeration} = await result.json()

        this.showCenters = showCenters
        this.showCurses = showCurses
        this.showDocs = showDocs
        this.showModeration = showModeration
    }
}
</script>

<style scoped>
.header-link {
    color: #000;
    text-decoration: none;
}
</style>