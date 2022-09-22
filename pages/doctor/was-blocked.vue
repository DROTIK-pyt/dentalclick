<template>
    <v-row>
        <v-col
        cols="12"
        sm="12"
        >
            <h1 class="text-center">Ваш профиль заблокирован.</h1>
            <p class="text-center">По всем вопросам обращайтесь в поддержку.</p>
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')

export default {
    data() {
        return {

        }
    },
    components: {},
    methods: {
        async getAllData() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/status`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['doctors/getTokens'].access
                },
                body: JSON.stringify({
                    educational_center_id: this.$store.getters['doctors/getId'],
                })
            })
            
            const responsed = await result.json()

            if(responsed.status != "blocked") {
                this.$router.push({path: "/doctor/profile"})
            }
        }
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('doctors/syncState')
        if (!this.$store.getters['doctors/getIsAuth']) {
            this.$router.push({path: `/doctor/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('doctors/saveState')
    }
}
</script>

<style scoped>

</style>