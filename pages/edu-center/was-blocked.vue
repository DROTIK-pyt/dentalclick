<template>
    <v-row>
        <v-col
        cols="12"
        sm="12"
        >
            <h1 class="text-center">Деятельность вашего образовательного центра приостановлена.</h1>
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
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu/status`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['eduCenter/getTokens'].access
                },
                body: JSON.stringify({
                    educational_center_id: this.$store.getters['eduCenter/getId'],
                })
            })

            console.log("sss")
            
            const responsed = await result.json()

            if(responsed.status != "blocked") {
                this.$router.push({path: "/edu-center/profile"})
            }
        }
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('eduCenter/syncState')
        if (!this.$store.getters['eduCenter/getIsAuth']) {
            this.$router.push({path: `/edu-center/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>

<style scoped>

</style>