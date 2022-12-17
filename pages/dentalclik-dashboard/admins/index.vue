<template>
    <v-row>
        <v-col
            cols="12"
            sm="6"
        >
            <v-btn
                class="mx-2"
                fab
                dark
                color="success"
                @click="toAddAdmin"
            >
                <v-icon dark>
                    mdi-plus
                </v-icon>
            </v-btn>
            <tableAdminsVue
                @editItem="toEditAdmin"
                @deleteItem="toDeleteAdmin"
            ></tableAdminsVue>
        </v-col>
        <addAdminVue
            v-if="isAdding"
            :isAdding="isAdding"
            @addAdmin="addAdmin"
            @closeAdd="closeAdd"
        ></addAdminVue>
        <deleteAdminVue
            v-if="isDelete"
            :isDelete="isDelete"
            @deleting="deletingAdmin"
        ></deleteAdminVue>
        <editAdminVue
            v-if="isEdit"
            :isEdit="isEdit"
            :admin="adminEdit"
            :msgErrorAdding="msgErrorAdding"
            @closeEdit="closeEdit"
            @saveAdmin="saveAdmin"
        ></editAdminVue>
    </v-row>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting')
const base64 = require('base-64')

import tableAdminsVue from '~/components/admins/tableAdmins.vue'
import addAdminVue from '~/components/admins/addAdmin.vue'
import deleteAdminVue from '~/components/admins/deleteAdmin.vue'
import editAdminVue from '~/components/admins/editAdmin.vue'

export default {
    layout: "ProfileSuperUser",
    data: () => ({
        isAdding: false,
        isEdit: false,
        isDelete: false,

        adminEdit: null,
        adminDelete: null,

        msgErrorAdding: "",
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
        toAddAdmin() {
            this.isAdding = true
        },
        async addAdmin() {
            this.closeAdd()
        },
        closeAdd() {
            this.isAdding = false
        },
        toEditAdmin(admin) {
            console.log(admin)

            this.adminEdit = admin
            this.isEdit = true
        },
        async saveAdmin() {
            this.closeEdit()
        },
        closeEdit() {
            this.adminEdit = null
            this.isEdit = false
        },
        toDeleteAdmin(admin) {
            this.adminDelete = admin
            this.isDelete = true
        },
        async deletingAdmin(action) {
            if(action) {
                await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        admin_id: this.adminDelete.admin_id,
                    })
                })
            }

            this.adminDelete = null
            this.isDelete = false
        },
        async getAllData() {
            this.checkAuth()
        },
    },
    components: {addAdminVue, tableAdminsVue, deleteAdminVue, editAdminVue},
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