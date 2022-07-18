<template>
    <header class="d-flex align-center pb-10">
        <v-row>
            <v-col class="left" cols="12" sm="3">
                <nuxt-link to="profile">
                    <v-img
                    :src="require('~/assets/images/dentalclick.png')"
                    width="190"
                    height="70"
                    contain
                    ></v-img>
                </nuxt-link>
            </v-col>
            <v-col class="right d-flex justify-space-between align-center" cols="12" sm="9" lg="5" offset-lg="4" tag="ul">
                <nuxt-link class="header-link text-h6" to="curses" v-if="isShowCurses">Мои курсы</nuxt-link>
                <nuxt-link class="header-link text-h6" to="reports" v-if="isShowReports">Мои отчеты</nuxt-link>
                <nuxt-link class="header-link text-h6" to="blog" v-if="isShowBlog">Мой блог</nuxt-link>
                <v-btn
                tile
                color="error"
                @click.prevent="eduLogout"
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
    name: "headerEdu",
    data() {
        return {
            isShowCurses: true,
            isShowReports: true,
            isShowBlog: true,
        }
    },
    methods: {
        eduLogout() {
            this.$store.commit('eduCenter/logout')
            this.$store.commit('eduCenter/saveState')
            this.$router.push({path: "/edu-center/login"})
        }
    },
    async beforeMount() {
        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/accesses`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                educational_center_id: this.$store.getters['eduCenter/getId']
            })
        })
        const {ecAccessRights} = await result.json()

        let rights = []
        for(const ecAccessRight of ecAccessRights) {
            rights.push(ecAccessRight.type)
        }

        if(!rights.includes('ec_access_curse'))
            this.isShowCurses = false
            
        if(!rights.includes('ec_access_reports'))
            this.isShowReports = false

        if(!rights.includes('ec_access_blog'))
            this.isShowBlog = false
    }
}
</script>

<style scoped>
.header-link {
    color: #000;
    text-decoration: none;
}
</style>