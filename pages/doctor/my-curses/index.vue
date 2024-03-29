<template>
    <v-row>
        <v-col cols="12" sm="12" xl="9">
        <v-select
          v-model="currentEduCenters"
          :items="eduCentersItems"
          :menu-props="{ maxHeight: '400' }"
          label="Выберите образовательные центры"
          multiple
          chips
          persistent-hint
        ></v-select>
        <TableCurses
            searchCurse=""
            :curseHeaders=curseHeaders
            :curses=curses 
            @showProgramm="showProgramm" 
        />
        <ProgrammCurse 
        :programm="contentCurseProgramm"
        :isShow="isShowCurseProgramm"
        @close="closeProgramm"
        />
        </v-col>
    </v-row>
</template>

<script>
import TableCurses from '@/components/doctors/TableCurses'
import ProgrammCurse from '@/components/doctors/ProgrammCurse'

const baseSettings = require('../../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: "ProfileDoc",
    components: { TableCurses, ProgrammCurse },
    data() {
        return {
            isShowCurseProgramm: false,
            contentCurseProgramm: {
                title: "",
                program: "",
                town: "",
                address: "",
                lector: "",
                date_start: "",
                date_end: "",
                price: "",
                score: "",
                isSubscribed: false,
                image: "",
            },

            searchCurse: "",
            eduCenters: [],
            eduCentersItems: [],
            currentEduCenters: [],
            curseHeaders: [
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
        }
    },
    methods: {
        async checkAuth() {
            if(this.$store.getters['doctors/getTokens'].refresh) {
                const refresh = this.$store.getters['doctors/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['doctors/getTokens'].access.split('.')[1]))

                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/status`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        doctor_id: this.$store.getters['doctors/getId'],
                    })
                })
                const responsed = await result.json()
                if(responsed.status === "blocked") {
                    this.$router.push({path: "/doctor/was-blocked"})
                }

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                            doctor_id: this.$store.getters['doctors/getId'],
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        this.$store.commit('doctors/authenticate', {
                            doctor_id: this.$store.getters['doctors/getId'],
                            tokens: responsed.tokens
                        })
                    } else {
                        this.$store.commit('doctors/logout')
                        this.$router.push({path: `/doctor/login`})
                    }
                }
            }
        },
        async getAllEduCenters() {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/all-centers`)

            const responsed = await result.json()
            if(responsed.ok) {
                this.eduCenters = responsed.centers
                this.eduCenters.forEach(center => {
                    this.eduCentersItems.push(center.title)
                })
            }
        },
        async getAllCursesViaECId(educational_center_ids) {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/all-curses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    educational_center_ids,
                    doctor_id: this.$store.getters['doctors/getId'],
                })
            })
            const responsed = await result.json()

            if(responsed.ok) {
                this.curses = responsed.curses
            }
        }, 
        async getAllData() {
            this.checkAuth()

            this.getAllEduCenters()
        },
        async showProgramm(curse_id) {
            this.checkAuth()

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/curse`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    curse_id: curse_id,
                    doctor_id: this.$store.getters['doctors/getId'],
                })
            })
            const response = await result.json()
            if (response.ok) {
                this.contentCurseProgramm.curse_id = curse_id
                this.contentCurseProgramm.title = response.curse.title
                this.contentCurseProgramm.program = response.curse.program
                this.contentCurseProgramm.town = response.curse.town
                this.contentCurseProgramm.address = response.curse.address
                this.contentCurseProgramm.lector = response.curse.lector
                this.contentCurseProgramm.date_start = response.curse.date_start
                this.contentCurseProgramm.date_end = response.curse.date_end
                this.contentCurseProgramm.price = response.curse.price
                this.contentCurseProgramm.score = response.curse.score
                this.contentCurseProgramm.isSubscribed = response.isSubscribed
                this.contentCurseProgramm.image = response.curse.image

                this.isShowCurseProgramm = true
            }
        },
        async closeProgramm() {
            this.checkAuth()

            this.isShowCurseProgramm = false

            this.contentCurseProgramm.title = null
            this.contentCurseProgramm.program = null
            this.contentCurseProgramm.town = null
            this.contentCurseProgramm.address = null
            this.contentCurseProgramm.lector = null
            this.contentCurseProgramm.date_start = null
            this.contentCurseProgramm.date_end = null
            this.contentCurseProgramm.price = null
            this.contentCurseProgramm.score = null
            this.contentCurseProgramm.image = null
        },
    },
    watch: {
        currentEduCenters(values) {
            this.checkAuth()
            
            if (values.length) {
                const ids = []
                values.forEach(value => {
                    const eduCenter = this.eduCenters.find(center => center.title === value)
                    
                    ids.push(eduCenter.educational_center_id)
                })
                this.getAllCursesViaECId(ids)
            } else {
                this.curses = []
            }
        }
    },
    beforeMount() {
        this.getAllData()

        this.$store.commit('doctors/syncState')
        if (!this.$store.getters['doctors/getIsAuth']) {
            this.$router.push({path: `/doctor/login`})
        }
    },
    beforeDestroy() {
        this.$store.commit('doctors/saveState')
    }
}
</script>

<style scoped>

</style>