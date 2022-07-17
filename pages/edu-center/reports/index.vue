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
// const json2excel = require('json2excel')
const baseSettings = require('../../../server/config/serverSetting')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            dates: [],
            isDownload: false,
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
            binaryExcel: null,
        }
    },
    methods: {
        async toFormating() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    dates: this.dates
                })
            }) 
            const {curses, doctors, eduCenter} = await result.json()

            for(let i = 0; i < curses.length; i++) {
                for(let j = 0; j < doctors.length; j++) {
                    this.itemsExcel.push({
                        name: doctors[j].name,
                        phone: doctors[j].phone,
                        email: doctors[j].email,
                        region: doctors[j].region,
                        titleEduCenter: eduCenter[0].title,
                        titleCurse: curses[i].title,
                        dateCurseStart: curses[i].date_start,
                        dateCurseEnd: curses[i].date_end,
                        price: curses[i].price,
                        town: curses[i].town,
                    })
                }
            }
        },
        downloadReport() {

        }
    },
}
</script>

<style scoped>

</style>