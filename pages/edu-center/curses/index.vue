<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <v-data-table
                :headers="curseHeaders"
                :items="curseTable"
                :search="searchCurse"
                sort-by="calories"
                class="elevation-1"
            >
                <template v-slot:top>
                <v-toolbar
                    flat
                >
                    <v-toolbar-title>Курсы</v-toolbar-title>
                    <v-divider
                    class="mx-4"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="searchCurse"
                        append-icon="mdi-magnify"
                        label="Поиск.."
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-divider
                    class="mx-6"
                    inset
                    vertical
                    ></v-divider>
                    <v-btn
                    tile
                    color="primary"
                    class="mr-5"
                    @click="toAddCurse"
                    >
                    <v-icon left>
                        mdi-plus
                    </v-icon>
                    Добавить курс
                    </v-btn>
                    <v-btn
                    tile
                    color="primary"
                    @click="doCategory"
                    >
                    <v-icon left>
                        mdi-table
                    </v-icon>
                    Категории
                    </v-btn>
                </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="toEditCurse(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    @click="toDeleteCurse(item)"
                >
                    mdi-delete
                </v-icon>
                </template>
            </v-data-table>
            <v-dialog
                v-model="isAddCurse"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                >
                <v-card>
                    <v-toolbar
                    dark
                    color="primary"
                    >
                    <v-btn
                        icon
                        dark
                        @click="cancelAddCurse"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Добавление нового курса</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                        dark
                        text
                        @click="confirmAddCurse"
                        >
                        Загрузить
                        </v-btn>
                    </v-toolbar-items>
                    </v-toolbar>
                    <v-card
                    three-line
                    subheader
                    >
                    <v-subheader>Данные курса</v-subheader>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Название"
                            v-model="addCurseTitle"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-textarea
                        name="input-7-1"
                        label="Программа курса"
                        rows="5"
                        row-height="20"
                        v-model="addCurseProgram"
                        ></v-textarea>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Город проведения"
                            v-model="addCurseTown"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Адрес проведения"
                            v-model="addCurseAddress"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="ФИО лектора(ов)"
                            v-model="addCurseLector"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-col
                        cols="12"
                        sm="3"
                        >
                        <span>Дата начала</span><br>
                        <br><v-date-picker v-model="addCurseDateStart"></v-date-picker>
                        </v-col>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-col
                        cols="12"
                        sm="3"
                        >
                        <span>Дата окончания</span><br>
                        <br><v-date-picker v-model="addCurseDateEnd"></v-date-picker>
                        </v-col>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Цена"
                            v-model="addCursePrice"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Баллы"
                            v-model="addCurseScore"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-col
                        cols="12"
                        sm="7"
                        >
                            <v-select
                                v-model="addCurseCategories"
                                :items="categories"
                                attach
                                chips
                                label="Категории"
                                multiple
                            ></v-select>
                        </v-col>
                    </v-list-item>
                    <v-list-item>
                        <v-col
                        cols="12"
                        sm="3"
                        >
                            <v-file-input
                            ref="imageCurse"
                            @change="fileUpload"
                            label="Картинка курса"
                            accept="image/*"
                            ></v-file-input>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="9"
                        >
                        <v-img
                        v-if="addCurseImagePreview"
                        max-height="178"
                        max-width="284"
                        :src="addCurseImagePreview"
                        ></v-img>
                        </v-col>
                    </v-list-item>
                    </v-card>
                </v-card>
            </v-dialog>
            <v-dialog
            v-model="showCategories"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
            <v-card>
                <v-toolbar
                dark
                color="primary"
                >
                <v-btn
                    icon
                    dark
                    @click="showCategories = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Все категории</v-toolbar-title>
                <v-spacer></v-spacer>
                </v-toolbar>
                <v-list
                three-line
                subheader
                >
                <v-list-item>
                    <v-list-item-content>
                    
                    </v-list-item-content>
                </v-list-item>
                </v-list>
            </v-card>
            </v-dialog>
            <v-dialog
                transition="dialog-bottom-transition"
                max-width="600"
                v-model="isAddCategory"
            >
                <v-card>
                    <v-toolbar
                    color="primary"
                    dark
                    >Добавить категорию</v-toolbar>
                    <v-card-text>
                        
                    </v-card-text>
                    <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="confirmAddCategory"
                    >Добавить</v-btn>
                    <v-btn
                        text
                        @click="cancelAddCategory"
                    >Отмена</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </div>
</template>

<script>
const { v4: uuidv4 } = require('uuid')
const baseSettings = require('../../../server/config/serverSetting')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            // данные курсов на добавление
            isAddCurse: false,
            addCurseTitle: "",
            addCurseProgram: "",
            addCurseTown: "",
            addCurseAddress: "",
            addCurseLector: "",
            addCurseDateStart: "",
            addCurseDateEnd: "",
            addCursePrice: null,
            addCurseScore: "",
            addCurseImage: "",
            addCurseImagePreview: "",
            addCurseUniqueSuffix: "",
            addCurseCategories: [],


            // данные курсов на редактирование
            isEditCurse: false,

            // данные курсов на удаление
            isDeleteCurse: false,

            showCategories: false,

            // данные категорий на добавление
            isAddCategory: false,
            addCategoryTitle: "",
            addCategoryImage: "",
            addCategoryUniqueSuffix: "",

            // данные категорий на редактирование
            isEditCategory: false,

            // данные категорий на удаление
            isDeleteCategory: false,

            curseHeaders: [
                {
                    text: 'Название',
                    align: 'start',
                    sortable: false,
                    value: 'title',
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
            curseTable: [],
            searchCurse: "",

            categoryHeaders: [
                {
                    text: 'Название',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                {
                    text: 'Действия',
                    align: 'start',
                    sortable: false,
                    value: 'actions',
                },
            ],
            categoryTable: [],
            categories: [],
        }
    },
    methods: {
        toAddCurse() {
            this.isAddCurse = true
        },
        async confirmAddCurse() {
            let formData = new FormData()

            formData.append('title', this.addCurseTitle)
            formData.append('program', this.addCurseProgram)
            formData.append('town', this.addCurseTown)
            formData.append('address', this.addCurseAddress)
            formData.append('lector', this.addCurseLector)
            formData.append('date_start', this.addCurseDateStart)
            formData.append('date_end', this.addCurseDateEnd)
            formData.append('price', this.addCursePrice)
            formData.append('score', this.addCurseScore)
            formData.append('categories', JSON.stringify(this.addCurseCategories))
            formData.append('uniqueSuffix', this.addCurseUniqueSuffix)
            formData.append('image', this.addCurseImage, this.addCurseImage.name)
            
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/add`, {
                method: "POST",
                headers: {
                    // 'Content-Type': 'multipart/form-data;boundary=MyBoundary'
                    // 'Content-Type': 'application/json;charset=utf-8'
                },
                body: formData
            })
            const newCurse = await result.json()
            this.curseTable.push(newCurse.aCurse)
            console.log(newCurse.aCurse)

            this.isAddCurse = false
        },
        cancelAddCurse() {
            this.addCurseTitle = ""
            this.addCurseProgram = ""
            this.addCurseTown = ""
            this.addCurseAddress = ""
            this.addCurseLector = ""
            this.addCurseDateStart = ""
            this.addCurseDateEnd = ""
            this.addCursePrice = null
            this.addCurseScore = ""
            this.addCurseImage = ""
            this.addCurseImagePreview = ""
            this.addCurseUniqueSuffix = ""

            this.isAddCurse = false
        },

        toEditCurse(curse) {},
        confirmEditCurse() {},
        cancelEditCurse() {},

        toDeleteCurse(curse) {},
        confirmDeleteCurse() {},
        cancelDeleteCurse() {},

        doCategory() {
            this.showCategories = true
        },

        toAddCategory() {
            this.isAddCategory = true
        },
        confirmAddCategory() {},
        cancelAddCategory() {},

        toEditCategory(category) {},
        confirmEditCategory() {},
        cancelEditCategory() {},

        toDeleteCategory(category) {},
        confirmDeleteCategory() {},
        cancelDeleteCategory() {},

        async getAllData() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses`)
            const data = await result.json()
            this.curseTable = data.curses
            this.categoryTable = data.categories

            this.categoryTable.forEach(cat => {
                this.categories.push(cat.title)
            })
        },
        
        fileUpload() {
            const filename = this.$refs.imageCurse.$refs.input.files
            this.addCurseImage = filename[0]
            this.addCurseUniqueSuffix = uuidv4()

            this.addCurseImagePreview = URL.createObjectURL(filename[0])
        }
    },
    beforeMount() {
        this.getAllData()
    }
}
</script>

<style scoped>

</style>