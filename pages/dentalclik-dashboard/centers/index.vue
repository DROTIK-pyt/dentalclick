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
                :status="statusCenter"
                @save="isSaving"
                @close="closeEdit"
                @stopCenter="toStopCenter"
                @deleteCenter="toDeleteCenter"
            />
            <AskChanges 
                :title="askTitle"
                :text="askText"
                :isShow="isShowAskEdit"
                @yes="saveEdit"
                @no="isShowAskEdit = false"
            />
            <AskChanges
                retain-focus="false"
                :title="askTitle"
                :text="askText"
                :isShow="isShowAskStop"
                @yes="stopCenter"
                @no="isShowAskStop = false"
            />
            <AskChanges
                retain-focus="false"
                :title="askTitle"
                :text="askText"
                :isShow="isShowAskDelete"
                @yes="deleteCenter"
                @no="isShowAskDelete = false"
            />
            <AddNewCenter
                :isShowAdd="isShowAdd"
                @closeAdd="closeAdd"
                @addNewCenter="addNewCenter"
            />
        </v-col>
        <v-col
        cols="12"
        sm="12"
        lg="4"
        >
        <v-btn
        depressed
        color="primary"
        @click="toAddNewCenter"
        >
        Добавить новый центр
        </v-btn>
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting')
const base64 = require('base-64')

import TableVue from '@/components/generals/TableVue'
import ViewCenter from '@/components/generals/ViewCenter'
import AskChanges from '@/components/generals/AskChanges'
import AddNewCenter from '@/components/super-user/AddNewCenter'

export default {
    layout: "ProfileSuperUser",
    components: { TableVue, ViewCenter, AskChanges, AddNewCenter },
    data() {
        return {
            search: "",
            headerEdu: [
                { text: 'Название', align: 'start', value: 'title' },
                { text: 'Контактное лицо', align: 'start', value: 'contact_person' },
                { text: 'Телефон', align: 'start', value: 'phone' },
                { text: 'Действие', align: 'start', value: 'actions' },
            ],
            centers: [],

            editCenter: {},
            isSaved: false,
            statusCenter: "",
            askTitle: "",
            askText: "",

            isShowAdd: false,
            isShowAskDelete: false,
            isShowEdit: false,
            isShowAskEdit: false,
            isShowAskStop: false,

            stopCenterId: "",
            deleteCenterId: "",
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
            this.checkAuth()

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
            responsed.center.password = ""
            this.statusCenter = responsed.status
            this.editCenter = responsed.center
            this.isShowEdit = true
        },
        isSaving() {
            this.checkAuth()

            this.askTitle = "Сохранить изменения?"
            this.askText = "Изменения вступят в силу незамедлительно."
            this.isShowAskEdit = true
        },
        async saveEdit() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/save-center`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    center: this.editCenter
                })
            })

            this.isShowEdit = false
            this.isShowAskEdit = false

            this.getAllData()
        },
        async closeEdit() {
            this.checkAuth()
            
            this.isShowEdit = false
        },
        toAddNewCenter() {
            this.checkAuth()

            this.isShowAdd = true
        },
        closeAdd() {
            this.checkAuth()

            this.isShowAdd = false
        },
        async addNewCenter(newCenter) {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/add-center`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    center: newCenter
                })
            })
            this.isShowAdd = false

            this.getAllData()
        },
        toStopCenter(id) {
            this.checkAuth()

            this.askTitle = "Измененить статус?"
            this.askText = "Это повлияет на работу центра."
            this.isShowAskStop = true
            this.stopCenterId = id
        },
        async stopCenter() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/stop-center`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    educational_center_id: this.stopCenterId
                })
            })
            const responsed = await result.json()
            this.statusCenter = responsed.status

            this.isShowAskStop = false
            this.isShowEdit = false
        },
        toDeleteCenter(id) {
            this.checkAuth()

            this.deleteCenterId = id

            this.askTitle = "Удалить центр?"
            this.askText = "Данное действие не обратимо. Восстановить будет крайне не просто."
            this.isShowAskDelete = true
        },
        async deleteCenter() {
            this.checkAuth()

            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/center`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    educational_center_id: this.deleteCenterId
                })
            })

            this.isShowAskDelete = false
            this.isShowEdit = false

            this.getAllData()
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