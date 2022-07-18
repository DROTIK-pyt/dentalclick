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
                    {{sortedDates}}
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
const fs = require('fs')

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
        }
    },
    computed: {
        sortedDates() {
            return this.dates.sort()
        }
    },
    async beforeMount() {
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
    }
}
</script>

<style scoped>

</style>