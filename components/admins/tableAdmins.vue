<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    data: () => ({
        headers: [
            { text: 'E-mail', value: 'login', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        admins: [],

    }),
    methods: {
        async checkAuth() {
            if(this.$store.getters['superuser/getTokens'].refresh) {
                const refresh = this.$store.getters['superuser/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['superuser/getTokens'].access.split('.')[1]))

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        console.log()
                        this.$store.commit('superuser/authenticate', {
                            tokens: responsed.tokens
                        })
                    } else {
                        this.$store.commit('superuser/logout')
                        this.$router.push({path: `/dentalclik-dashboard/login`})
                    }
                }
            }
        },
        editItem(item) {
            this.$emit("editItem", item)
        },
        deleteItem(item) {
            this.$emit("deleteItem", item)
        },
        async getAllData() {
            this.checkAuth()

            const data = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin`)
            const result = await data.json()

            if(result.ok) {
                // console.log(result.admins)
                this.admins = result.admins
            }
        },
    },
    async beforeMount() {
        this.getAllData()
    },
}
</script>

<style scoped>

</style>