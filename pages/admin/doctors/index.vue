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
    layout: "ProfileAdmin",
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
                const {showDocs} = await result.json()

                if (!showDocs) {
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
                const {showDocs} = await result.json()

                if (!showDocs) {
                    this.$router.go(-1)
                }
            } else {
                this.$store.commit('admins/logout')
                this.$router.push({path: `/admin/login`})
            }
        },
        async getAllData() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/doctors`)
            const responsed = await result.json()

            if(responsed.ok) {
                this.doctors = responsed.docs
            }
        },
        async toEditDoctor(doctor) {
            this.askTitle = "Принять изменения?"
            this.askText = "Информация польлзователя будет изменена"

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/doctor-status`, {
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
            
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/doctor`, {
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