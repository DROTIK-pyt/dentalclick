<template>
    <header class="d-flex align-center pb-10">
        <v-row>
            <v-col class="left" cols="12" sm="3">
                <nuxt-link to="/">
                    <v-img
                    :src="require('~/assets/images/dentalclick.png')"
                    width="190"
                    height="70"
                    contain
                    ></v-img>
                </nuxt-link>
            </v-col>
            <v-col class="right d-flex justify-space-between align-center" cols="12" sm="4" offset-sm="5" tag="ul">
                <nuxt-link class="header-link text-h6" to="edu-center/curses">Мои курсы</nuxt-link>
                <nuxt-link class="header-link text-h6" to="edu-center/report">Мои отчеты</nuxt-link>
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
export default {
    name: "headerEdu",
    data() {
        return {
            
        }
    },
    methods: {
        eduLogout() {
            this.$store.commit('eduCenter/logout')
            this.$store.commit('eduCenter/saveState')
            this.$router.push({path: "/edu-center/login"})
        }
    }
}
</script>

<style scoped>
.header-link {
    color: #000;
    text-decoration: none;
}
</style>