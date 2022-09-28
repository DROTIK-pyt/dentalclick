<template>
    <v-row>
        <v-col
        cols="12"
        sm="12"
        lg="9"
        >
            <TableVue
                :headers="headerCurse"
                :items="curses"
                title="Курсы"
                @editItem="toEditCurse"
            />
            <EditCurse
                v-if="isEditCurse"
                :titleCurse="curseTitle"
                :isShow="isEditCurse"
                :aCurse="editCurse"
                :categoryItems="editCategories"
                :allCategoryItem="editAllCategories"
                :cat2idItems="editCats2id"
                @close="isEditCurse = false"
                @saveCurseItem="saveCurseItem"
            />
            <AskChanges
                :title="askTitle"
                :text="askText"
                :isShow="isShowASkEdit"
                @yes="saveEditCurse"
                @no="isEditCurse = false; isShowASkEdit = false"
            />
        </v-col>
    </v-row>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting')

import TableVue from '@/components/generals/TableVue'
import AskChanges from '@/components/generals/AskChanges'
import EditCurse from '@/components/super-user/EditCurse'

export default {
    layout: "ProfileSuperUser",
    data() {
        return {
            headerCurse: [
            {
                    text: 'Название',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                {
                    text: 'Обр. центр',
                    align: 'start',
                    sortable: false,
                    value: 'eduCenter',
                },
                {
                    text: 'Лектор(ы)',
                    align: 'start',
                    sortable: false,
                    value: 'lector',
                },
                {
                    text: 'Дата начала',
                    align: 'start',
                    sortable: false,
                    value: 'date_start',
                },
                {
                    text: 'Дата окончания',
                    align: 'start',
                    sortable: false,
                    value: 'date_end',
                },
                {
                    text: 'Цена',
                    align: 'start',
                    sortable: false,
                    value: 'price',
                },
                {
                    text: 'Баллы',
                    align: 'start',
                    sortable: false,
                    value: 'score',
                },
                {
                    text: 'Действия',
                    align: 'start',
                    sortable: false,
                    value: 'actions',
                },
            ],
            curses: [],
            askTitle: "",
            askText: "",

            isEditCurse: false,
            isShowASkEdit: false,

            curseTitle: "",
            editCurseId: "",
            editCurse: {},
            editCategories: [],
            editAllCategories: [],
            editCats2id: {},

            resultCurse: "",
        }
    },
    components: { TableVue, AskChanges, EditCurse, EditCurse },
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
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/all-curse`)
            const responsed = await result.json()

            if(responsed.ok) {
                this.curses = responsed.curses
            }
        },
        async toEditCurse(curse) {
            this.askTitle = "Применить изменения?"
            this.askText = "Изменения вступят в силу незамедлительно."

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/curse-categories`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    curse_id: curse.curse_id
                })
            })
            const responsed = await result.json()

            if(responsed.ok) {

                this.editCategories = responsed.nameCats
                this.editCats2id = responsed.cats2id
                this.editAllCategories = responsed.allCats

                this.editCurseId = curse.curse_id
                this.curseTitle = curse.title
                this.editCurse = curse
                this.isEditCurse = true
            }
        },
        async saveEditCurse() {
            this.isShowASkEdit = false

            console.log(this.resultCurse)

            this.isEditCurse = false
        },
        saveCurseItem(dataCurse) {
            this.isShowASkEdit = true
            this.resultCurse = dataCurse
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