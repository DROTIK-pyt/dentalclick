<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <v-row>
                <v-col
                cols="12"
                sm="12"
                >   
                    <h2 class="mb-3">Отчет в Excel по записавшимся на курсы</h2>
                    <v-date-picker
                        v-model="dates"
                        range
                        :min="minAllowed"
                        :max="maxAllowed"
                    ></v-date-picker>
                    <v-btn
                    color="success"
                    x-large
                    dark
                    @click="toFormating"
                    >
                    Сформировать
                    </v-btn>
                    <v-btn
                    color="success"
                    small
                    dark
                    v-if="isDownload"
                    @click="downloadReport"
                    >
                    Скачать
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col
        cols="12"
        sm="3"
        >

        </v-col>
    </div>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            dates: [],
            isDownload: false,
            maxAllowed: "",
            minAllowed: "",
            headerExcel: {
                "name": "ФИО",
                "phone": "Телефон",
                "email": "E-mail",
                "region": "Регион",
                "titleEduCenter": "Образовательный центр",
                "titleCurse": "Название курса",
                "dateCurseStart": "Дата начала",
                "dateCurseEnd": "Дата завершения",
                "price": "Цена",
                "town": "Город проведения",
            },
            itemsExcel: [],
            sheet: {
                header: this.headerExcel,
                items: this.itemsExcel,
                sheetName: "Выгрузка"
            },
            dataDownload: {
                sheets: [this.sheet],
                filepath: '../../../static/reports/report.xlxs'
            },
            rights: [],
        }
    },
    methods: {
        async toFormating() {
            this.checkAuth()

            this.checkRight()

            const educational_center_id = this.$store.getters['eduCenter/getId']

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    dates: this.sortedDates,
                    educational_center_id: educational_center_id
                })
            })
            const excel = await result.blob()
            const url = URL.createObjectURL(excel)
            const a = document.createElement('a')
            a.href = url
            a.download = 'report.xlsx'
            a.style.display = 'none'
            a.click()

            // fs.writeFileSync('../../../static/reports/report.xlsx', excel)

        },
        checkRight() {
            if(!this.rights.includes('ec_access_reports')) {
                this.$router.go(-1)
            }
        },
        async checkAuth() {
            if(this.$store.getters['eduCenter/getTokens'].refresh) {
                const refresh = this.$store.getters['eduCenter/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['eduCenter/getTokens'].access.split('.')[1]))

                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu/status`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        educational_center_id: this.$store.getters['eduCenter/getId'],
                    })
                })
                const responsed = await result.json()
                if(responsed.status === "blocked") {
                    this.$router.push({path: "/edu-center/was-blocked"})
                }

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8000) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/refresh`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            refresh: refresh,
                            educational_center_id: this.$store.getters['eduCenter/getId'],
                        })
                    })
                    const responsed = await result.json()
                    if(responsed.ok) {
                        this.$store.commit('eduCenter/authenticate', {
                            educational_center_id: this.$store.getters['eduCenter/getId'],
                            tokens: responsed.tokens
                        })
                    } else {
                        this.$store.commit('eduCenter/logout')
                        this.$router.push({path: `/edu-center/login`})
                    }
                }
            }
        },
    },
    computed: {
        sortedDates() {
            return this.dates.sort()
        }
    },
    async beforeMount() {
        this.$store.commit('eduCenter/syncState')

        let result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/accesses`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                educational_center_id: this.$store.getters['eduCenter/getId']
            })
        })
        const {ecAccessRights} = await result.json()

        for(const ecAccessRight of ecAccessRights) {
            this.rights.push(ecAccessRight.type)
        }

        this.checkRight()
        
        const educational_center_id = this.$store.getters['eduCenter/getId']

        result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/reports/maxmin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                educational_center_id: educational_center_id
            })
        })

        const {minAllowed, maxAllowed} = await result.json()
        this.minAllowed = minAllowed
        this.maxAllowed = maxAllowed
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>

<style scoped>

</style>