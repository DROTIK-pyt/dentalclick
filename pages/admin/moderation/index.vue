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
                :items="modersItem"
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
    layout: "ProfileAdmin",
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
    computed: {
        modersItem() {
            return this.moders.reverse()
        },
    },
    methods: {
        async checkAccess() {
            if(this.$store.getters['admins/getIsAuth']) {
                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        admin_id: this.$store.getters['admins/getId']
                    })
                })
                const {showModeration} = await result.json()

                if (!showModeration) {
                    this.$router.go(-1)
                    return
                }
            } else {
                this.$store.commit('admins/logout')
                this.$router.push({path: `/admin/login`})
            }
        },
        async checkAuth() {
            if(this.$store.getters['admins/getTokens'].refresh) {
                const refresh = this.$store.getters['admins/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['admins/getTokens'].access.split('.')[1]))

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                            admin_id: this.$store.getters['admins/getId'],
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        console.log()
                        this.$store.commit('admins/authenticate', {
                            tokens: responsed.tokens,
                            admin_id: responsed.admin_id,
                        })
                        this.$store.commit('admins/saveState')
                    } else {
                        this.$store.commit('admins/logout')
                        this.$router.push({path: `/admin/login`})
                    }
                }
            }
        },
        async checkAccess() {
            if(this.$store.getters['admins/getIsAuth']) {
                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        admin_id: this.$store.getters['admins/getId']
                    })
                })
                const {showModeration} = await result.json()

                if (!showModeration) {
                    this.$router.go(-1)
                }
            } else {
                this.$store.commit('admins/logout')
                this.$router.push({path: `/admin/login`})
            }
        },
        async getAllData() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/all-moderations`)
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
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accept-moderation`, {
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
    async beforeMount() {
        await this.checkAccess()

        this.getAllData()

        this.$store.commit('admins/syncState')
        if (!this.$store.getters['admins/getIsAuth']) {
            this.$router.push({path: `/admin/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('admins/saveState')
    }
}
</script>

<style scoped>

</style>