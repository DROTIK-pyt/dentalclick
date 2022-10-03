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
                :statusCurse="statusCurse"
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
        <v-col>
            <v-btn
                class="ma-2"
                :loading="loading"
                :disabled="loading"
                color="info"
                @click="updateAllData"
                >
                Обновить курсы
                <template v-slot:loader>
                    <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                    </span>
                </template>
            </v-btn>
            <v-select
                v-model="currentStatus"
                :items="items"
                label="Статус"
                solo
            ></v-select>
        </v-col>
    </v-row>
</template>

<script>
const base64 = require('base-64')
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
                    text: 'Цена ₽',
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
            trashedCurses: [],
            publicCurses: [],
            allCurses: [],

            items: [ 'Все', 'В корзине', 'Опубликованные' ],
            currentStatus: "Все",
            askTitle: "",
            askText: "",

            isEditCurse: false,
            isShowASkEdit: false,
            loading: false,

            curseTitle: "",
            editCurseId: "",
            editCurse: {},
            editCategories: [],
            editAllCategories: [],
            editCats2id: {},
            statusCurse: {},

            resultCurse: "",
        }
    },
    components: { TableVue, AskChanges, EditCurse, EditCurse },
    computed: {
        curses() {
            if(this.currentStatus === "Все") {
                return this.allCurses
            }
            if(this.currentStatus === "В корзине") {
                return this.trashedCurses
            }
            if(this.currentStatus === "Опубликованные") {
                return this.publicCurses
            }
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

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/all-curse`)
            const responsed = await result.json()

            if(responsed.ok) {
                this.allCurses = responsed.curses
                this.trashedCurses = responsed.trashed
                this.publicCurses = responsed.public
            }
        },
        updateAllData() {
            this.checkAuth()

            this.loading = true

            this.getAllData()

            setTimeout(() => {
                this.loading = false
            }, 300)
        },
        async toEditCurse(curse) {
            this.checkAuth()

            this.askTitle = "Применить изменения?"
            this.askText = "Изменения вступят в силу незамедлительно."

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/data-curse`, {
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

                if(responsed.statusCurse.length == 0) {
                    this.statusCurse.status_id = 1
                } else {
                    this.statusCurse.status_id = responsed.statusCurse[0].status_id
                }

                this.editCurseId = curse.curse_id
                this.curseTitle = curse.title
                this.editCurse = curse
                this.isEditCurse = true
            }
        },
        async saveEditCurse() {
            this.checkAuth()

            this.isShowASkEdit = false

            // console.log(this.resultCurse.image.src.name)

            let formData = new FormData()

            formData.append('curse_id', this.resultCurse.curse.curse_id)
            formData.append('title', this.resultCurse.curse.title)
            formData.append('program', this.resultCurse.curse.program)
            formData.append('town', this.resultCurse.curse.town)
            formData.append('address', this.resultCurse.curse.address)
            formData.append('lector', this.resultCurse.curse.lector)
            formData.append('date_start', this.resultCurse.curse.date_start)
            formData.append('date_end', this.resultCurse.curse.date_end)
            formData.append('price', this.resultCurse.curse.price)
            formData.append('score', this.resultCurse.curse.score)
            formData.append('status_id', this.resultCurse.status_id)
            formData.append('categories', JSON.stringify(this.resultCurse.catIds))
            formData.append('uniqueSuffix', this.resultCurse.image.suffix)
            if(this.resultCurse.image.src)
                formData.append('image', this.resultCurse.image.src, this.resultCurse.image.src.name)

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/put-curses`, {
                method: "POST",
                headers: {
                    // 'Content-Type': 'multipart/form-data;boundary=MyBoundary'
                    // 'Content-Type': 'application/json;charset=utf-8'
                },
                body: formData
            })
            const responsed = await result.json()
            if(responsed.ok) {
                this.isEditCurse = false

                this.getAllData()
            }
        },
        saveCurseItem(dataCurse) {
            this.checkAuth()

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
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>