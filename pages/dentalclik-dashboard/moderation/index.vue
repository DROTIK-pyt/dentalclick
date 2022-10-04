<template>
    <v-row>
        <v-col
            cols="12"
            sm="12"
            lg="9"
        >
            <TableVueModer
                @editItem="toShowInfo"
                title="Модерации"
                :headers="headerModer"
                :items="moders"
            />
            <ViewModeration
                :isShow="isViewModer"
                :moderData="showModer"
                @accept="acceptNewData"
                @close="closeShow"
            />
        </v-col>
    </v-row>
</template>

<script>
const base64 = require('base-64')
const baseSettings = require('../../../server/config/serverSetting')

import TableVueModer from '~/components/generals/TableVueModer'
import ViewModeration from '~/components/generals/ViewModeration'

export default {
    layout: "ProfileSuperUser",
    data() {
        return {
            headerModer: [
                {
                    text: '№',
                    align: 'start',
                    sortable: false,
                    value: 'moderation_id',
                },
                {
                    text: 'Тип',
                    align: 'start',
                    sortable: false,
                    value: 'currType',
                },
                {
                    text: 'Действие',
                    align: 'start',
                    sortable: false,
                    value: 'actions',
                },
            ],
            moders: [],

            showModer: {},

            isViewModer: false,
        }
    },
    components: { TableVueModer, ViewModeration },
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

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/all-moderations`)
            const responsed = await result.json()

            if(responsed.ok) {
                this.moders = responsed.aModerations
            }
        },
        toShowInfo(data) {
            this.showModer = data

            this.isViewModer = true
        },
        closeShow() {
            this.showModer = {}

            this.isViewModer = false
        },
        async acceptNewData() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/accept-moderation`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    data: this.showModer
                })
            })
            const responsed = await result.json()

            if(responsed.ok) {
                this.closeShow()
                this.getAllData()
            }
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