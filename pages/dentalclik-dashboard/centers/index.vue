<template>
    <v-row>
        <v-col
        cols="12"
        sm="12"
        lg="8"
        >
            <TableVue 
                :headers="headerEdu"
                :items="centers"
                title="Центры"
                @editItem="toEditCenter"
            />
            <ViewCenter
                :title="editCenter.title"
                :isShow="isShowEdit"
                :center="editCenter"
                @save="saveEdit"
                @close="closeEdit"
            />
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting')
const base64 = require('base-64')

import TableVue from '@/components/generals/TableVue'
import ViewCenter from '@/components/generals/ViewCenter'

export default {
    layout: "ProfileSuperUser",
    components: { TableVue, ViewCenter },
    data() {
        return {
            search: "",
            headerEdu: [
                { text: 'Название', align: 'start', value: 'title' },
                { text: 'Контактное лицо', align: 'start', value: 'contact_person' },
                { text: 'Телефон', align: 'start', value: 'phone' },
                { text: 'Actions', align: 'start', value: 'actions' },
            ],
            centers: [],

            editCenter: {},
            isShowEdit: false
        }
    },
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
        async getAllData() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/centers`)
            const responsed = await result.json()
            
            if(responsed.ok)
                this.centers = responsed.centers
        },
        async toEditCenter(center) {
            console.log(center)
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/get-center`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    educational_center_id: center.educational_center_id,
                })
            })
            const responsed = await result.json()
            this.editCenter = responsed.center
            this.isShowEdit = true
        },
        async saveEdit() {

            this.isShowEdit = false
        },
        async closeEdit() {
            
            this.isShowEdit = false
        },
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