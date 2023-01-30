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
                v-if="isShowEdit"
                :title="editCenter.title"
                :isShow="isShowEdit"
                :center="editCenter"
                :status="statusCenter"
                :rights="rights"
                :rightsEdu="rightsEdu"
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
        v-if="isAdmin && canAddCenter"
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
    layout: "ProfileAdmin",
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
            rights: [],
            rightsEdu: [],

            tookRights: [],

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

            canAddCenter: false,
            isAdmin: false,
        }
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
                const {showCenters, rights} = await result.json()

                if (!showCenters) {
                    this.$router.go(-1)
                    return
                }

                this.isAdmin = true
                this.canAddCenter = rights.includes('admin_add_center')
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
        async getAllData() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/centers`)
            const responsed = await result.json()
            
            if(responsed.ok)
                this.centers = responsed.centers
        },
        async toEditCenter(center) {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/get-center`, {
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
            this.rightsEdu = responsed.rights
            this.rights = responsed.allRights
        },
        isSaving(currentRights) {
            this.checkAuth()

            this.askTitle = "Сохранить изменения?"
            this.askText = "Изменения вступят в силу незамедлительно."
            this.isShowAskEdit = true

            this.tookRights = currentRights
        },
        async saveEdit() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/save-center`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    center: this.editCenter,
                    rights: this.tookRights
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

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/add-center`, {
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

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/stop-center`, {
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

            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/center`, {
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
    async beforeMount() {
        await this.checkAccess()
        
        this.getAllData()

        this.$store.commit('admins/syncState')
        if (!this.$store.getters['admins/getIsAuth']) {
            this.$router.push({path: `/admin/login`})
        }

        if(this.$store.getters['admins/getId']) {
            this.isAdmin = true

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    admin_id: this.$store.getters['admins/getId']
                })
            })
            const {accessRights} = await result.json()

            let rights = []
            for(const accessRight of accessRights) {
                rights.push(accessRight.type)
            }

            if(rights.includes('admin_add_center')) {
                this.canAddCenter = true
            }
        }
    },
    beforeDestroy() {
        this.$store.commit('admins/saveState')
    }
}
</script>

<style scoped>

</style>