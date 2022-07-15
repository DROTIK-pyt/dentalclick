<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <v-data-table
                :headers="curseHeaders"
                :items="dataTableItems"
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
                    class="mr-5"
                    @click="doCategory"
                    >
                    <v-icon left>
                        mdi-table
                    </v-icon>
                    Категории
                    </v-btn>
                    <v-btn
                    tile
                    :color="trashBtnColor"
                    @click="showTrash = !showTrash"
                    >
                    <v-icon left>
                        mdi-trash-can
                    </v-icon>
                    {{ trashBtnTitle }}
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
                v-model="isEditCurse"
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
                        @click="cancelEditCurse"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Редактирование нового курса</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                        dark
                        text
                        @click="confirmEditCurse"
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
                            v-model="editCurseTitle"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-textarea
                        name="input-7-1"
                        label="Программа курса"
                        rows="5"
                        row-height="20"
                        v-model="editCurseProgram"
                        ></v-textarea>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Город проведения"
                            v-model="editCurseTown"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Адрес проведения"
                            v-model="editCurseAddress"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="ФИО лектора(ов)"
                            v-model="editCurseLector"
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
                        <br><v-date-picker v-model="editCurseDateStart"></v-date-picker>
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
                        <br><v-date-picker v-model="editCurseDateEnd"></v-date-picker>
                        </v-col>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Цена"
                            v-model="editCursePrice"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                        <v-text-field
                            label="Баллы"
                            v-model="editCurseScore"
                        ></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-col
                        cols="12"
                        sm="7"
                        >
                            <v-select
                                v-model="editCurseCategories"
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
                            ref="imageCurseEdit"
                            @change="fileUploadEdit"
                            label="Картинка курса"
                            accept="image/*"
                            ></v-file-input>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="9"
                        >
                        <v-img
                        v-if="editCurseImagePreview"
                        max-height="178"
                        max-width="284"
                        :src="editCurseImagePreview"
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
            <v-dialog
            v-model="isDeleteCurse"
            persistent
            max-width="290"
            >
            <v-card>
                <v-card-title class="text-h5">
                Удалить {{ deleteCurseTitle }}?
                </v-card-title>
                <v-card-text>Курс будет перемещен в корзину</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="cancelDeleteCurse"
                >
                    Отмена
                </v-btn>
                <v-btn
                    color="green darken-1"
                    text
                    @click="confirmDeleteCurse"
                >
                    Хорошо
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog
            v-model="showEditInTrashError"
            persistent
            max-width="380"
            >
            <v-card>
                <v-card-title class="text-h5">
                Для редактирования нужно восстановить курс
                </v-card-title>
                <v-card-text>Курс будет восстановлен.</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="cancelReestablishCurse"
                >
                    Отмена
                </v-btn>
                <v-btn
                    color="green darken-1"
                    text
                    @click="confirmReestablishCurse"
                >
                    восстановить
                </v-btn>
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
            trashBtnTitle: "Корзина",
            trashBtnColor: "error",


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
            editCurseId: "",
            editCurseTitle: "",
            editCurseProgram: "",
            editCurseTown: "",
            editCurseAddress: "",
            editCurseLector: "",
            editCurseDateStart: "",
            editCurseDateEnd: "",
            editCursePrice: "",
            editCurseScore: "",
            editCurseImage: "",
            editCurseImagePreview: "",
            editCurseUniqueSuffix: "",
            editCurseCategories: [],


            // данные курсов на удаление
            isDeleteCurse: false,
            deleteCurseId: "",
            deleteCurseTitle: "",

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
            trashTable: [],
            showTrash: false,
            showEditInTrashError: false,
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

        toEditCurse(curse) {
            if (!this.isShowEditInTrashError) {
                this.isEditCurse = true

                this.editCurseId = curse.curse_id
                this.editCurseTitle = curse.title
                this.editCurseProgram = curse.program
                this.editCurseTown = curse.town
                this.editCurseAddress = curse.address
                this.editCurseLector = curse.lector
                this.editCurseDateStart = curse.date_start
                this.editCurseDateEnd = curse.date_end
                this.editCursePrice = curse.price
                this.editCurseScore = curse.score
                this.editCurseImage = null
                this.editCurseImagePreview = curse.image
                this.editCurseUniqueSuffix = ""
            } else {
                this.showEditInTrashError = true
                this.editCurseId = curse.curse_id
            }
        },
        async confirmEditCurse() {
            let formData = new FormData()

            formData.append('curse_id', this.editCurseId)
            formData.append('title', this.editCurseTitle)
            formData.append('program', this.editCurseProgram)
            formData.append('town', this.editCurseTown)
            formData.append('address', this.editCurseAddress)
            formData.append('lector', this.editCurseLector)
            formData.append('date_start', this.editCurseDateStart)
            formData.append('date_end', this.editCurseDateEnd)
            formData.append('price', this.editCursePrice)
            formData.append('score', this.editCurseScore)
            formData.append('categories', JSON.stringify(this.editCurseCategories))
            formData.append('uniqueSuffix', this.editCurseUniqueSuffix)
            formData.append('image', this.editCurseImage, this.editCurseImage.name)
            
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/edit`, {
                method: "PUT",
                headers: {
                    // 'Content-Type': 'multipart/form-data;boundary=MyBoundary'
                    // 'Content-Type': 'application/json;charset=utf-8'
                },
                body: formData
            })
            this.getAllData()

            this.isEditCurse = false
            this.showEditInTrashError = false
        },
        cancelEditCurse() {
            this.editCurseTitle = ""
            this.editCurseProgram = ""
            this.editCurseTown = ""
            this.editCurseAddress = ""
            this.editCurseLector = ""
            this.editCurseDateStart = ""
            this.editCurseDateEnd = ""
            this.editCursePrice = null
            this.editCurseScore = ""
            this.editCurseImage = ""
            this.editCurseImagePreview = ""
            this.editCurseUniqueSuffix = ""

            this.isAddCurse = false
        },

        toDeleteCurse(curse) {
            this.isDeleteCurse = true

            this.deleteCurseId = curse.curse_id
            this.deleteCurseTitle = curse.title
        },
        async confirmDeleteCurse() {
            if (!this.showTrash) {
                await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/trash`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        curse_id: this.deleteCurseId
                    })
                })
                this.getAllData()
                this.isDeleteCurse = false
            } else {
                await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        curse_id: this.deleteCurseId
                    })
                })
                this.getAllData()
                this.isDeleteCurse = false
            }
        },
        cancelDeleteCurse() {
            this.isDeleteCurse = false
            this.deleteCurseId = ""
            this.deleteCurseTitle = ""
        },
        async confirmReestablishCurse() {
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/reestablish`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    curse_id: this.editCurseId
                })
            })

            this.showEditInTrashError = false
            this.getAllData()
        },
        cancelReestablishCurse() {
            this.showEditInTrashError = false
        },

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
            this.trashTable = data.trashedCurses

            this.categoryTable.forEach(cat => {
                this.categories.push(cat.title)
            })
        },
        
        fileUpload() {
            const filename = this.$refs.imageCurse.$refs.input.files
            this.addCurseImage = filename[0]
            this.addCurseUniqueSuffix = uuidv4()

            this.addCurseImagePreview = URL.createObjectURL(filename[0])
        },
        fileUploadEdit() {
            const filename = this.$refs.imageCurseEdit.$refs.input.files
            this.editCurseImage = filename[0]
            this.editCurseUniqueSuffix = uuidv4()

            this.editCurseImagePreview = URL.createObjectURL(filename[0])
        }
    },
    beforeMount() {
        this.getAllData()
    },
    computed: {
        dataTableItems() {
            if(this.showTrash) {
                this.isShowEditInTrashError = true
                this.trashBtnColor = 'success'
                this.trashBtnTitle = 'Курсы'
                return this.trashTable
            }
            this.isShowEditInTrashError = false
            this.trashBtnColor = 'error'
            this.trashBtnTitle = 'Корзина'
            return this.curseTable
        }
    }
}
</script>

<style scoped>

</style>