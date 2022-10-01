<template>
    <v-row>
        <v-col
        cols="12"
        sm="12"
        md="9"
        >
            <TableVue
                @editItem="toEditDoctor"
                title="Докторы"
                :headers="docTableHeader"
                :items="doctors"
            />
            <AskChanges
                :title="askTitle"
                :text="askText"
                :isShow="isShowASkEdit"
                @yes="saveEditDoctor"
                @no="isShowEdit = false; isShowASkEdit = false"
            />
            <EditDoctor
                v-if="isShowEdit"
                :doctor="editDoctor"
                :currentDoctorStatus="currentStatus"
                :statuses="statuses"
                :stat2id="stat2id"
                :isShow="isShowEdit"
                @close="closeEdit"
                @saveDoctor="saveDoctor"
            />
        </v-col>
    </v-row>
</template>

<script>
const base64 = require('base-64')
const baseSettings = require('../../../server/config/serverSetting')

import TableVue from '@/components/generals/TableVue'
import AskChanges from '@/components/generals/AskChanges'
import EditDoctor from '@/components/super-user/EditDoctor'

export default {
    layout: "ProfileSuperUser",
    data() {
        return {
            docTableHeader: [
                {
                    text: 'Имя',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                {
                    text: 'E-mail',
                    align: 'start',
                    sortable: false,
                    value: 'email',
                },
                {
                    text: 'Телефон',
                    align: 'start',
                    sortable: false,
                    value: 'phone',
                },
                {
                    text: 'Регион',
                    align: 'start',
                    sortable: false,
                    value: 'region',
                },
                {
                    text: 'Специализация',
                    align: 'start',
                    sortable: false,
                    value: 'specialization',
                },
                {
                    text: 'Действие',
                    align: 'start',
                    sortable: false,
                    value: 'actions',
                },
            ],
            doctors: [],
            
            statuses: [ 'Доступен', 'Заблокирован' ],
            stat2id: {
                "Доступен": 1,
                "Заблокирован": 3,
            },

            editDoctor: "",
            editTookDoctorData: "",
            currentStatus: "Доступен",
            
            askTitle: "",
            askText: "",

            isShowASkEdit: false,
            isShowEdit: false,
        }
    },
    components: { TableVue, AskChanges, EditDoctor },
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

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/doctors`)
            const responsed = await result.json()

            if(responsed.ok) {
                this.doctors = responsed.docs
            }
        },
        async toEditDoctor(doctor) {
            this.askTitle = "Принять изменения?"
            this.askText = "Информация польлзователя будет изменена"

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/doctor-status`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    doctor_id: doctor.doctor_id
                })
            })
            const responsed = await result.json()
            if(responsed.ok) {
                this.currentStatus = responsed.status
            }

            this.editDoctor = doctor

            this.isShowEdit = true
        },
        saveDoctor(doctorData) {
            this.isShowASkEdit = true

            this.editTookDoctorData = doctorData
        },
        async saveEditDoctor() {
            this.isShowASkEdit = false
            this.isShowEdit = false
            
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/doctor`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    data: this.editTookDoctorData
                })
            })
        },
        closeEdit() {
            this.getAllData()

            this.isShowEdit = false
        }
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