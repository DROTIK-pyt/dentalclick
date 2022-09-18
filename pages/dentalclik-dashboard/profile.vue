<template>
    <v-row>

    </v-row>
</template>

<script>
export default {
    layout: "ProfileSuperUser",
    components: {},
    data() {
        return {

        }
    },
    methods: {
        async getAllData() {},
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('superuser/syncState')
        if (!this.$store.getters['superuser/getIsAuth']) {
            this.$router.push({path: `/dentalclik-dashboard/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('superuser/saveState')
    }
}
</script>

<style scoped>

</style>