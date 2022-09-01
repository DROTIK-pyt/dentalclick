<template>
    <div>
        <v-col
        cols="12"
        sm="12"
        md="12"
        lg="10"
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
                    height="100"
                >
                    <v-toolbar-title>Курсы</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-row>
                        <v-col
                        cols="12"
                        md="3"
                        >
                        <v-text-field
                            v-model="searchCurse"
                            append-icon="mdi-magnify"
                            label="Поиск.."
                            single-line
                            hide-details
                        ></v-text-field>
                        </v-col>
                        <v-divider
                        class="mx-2"
                        inset
                        vertical
                        ></v-divider>
                        <v-col
                        cols="12"
                        md="8"
                        >
                            <v-btn
                            tile
                            color="primary"
                            class="mr-1"
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
                            class="mr-1"
                            @click="doCategory"
                            v-if="isShowCategoryBtn"
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
                            v-if="isShowTrashBtn"
                            >
                            <v-icon left>
                                mdi-trash-can
                            </v-icon>
                            {{ trashBtnTitle }}
                            </v-btn>
                        </v-col>
                    </v-row>
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
                    <v-row class="ma-0">
                        <v-col
                        cols="12"
                        sm="7"
                        >
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
                            <v-row>
                                <v-col
                                cols="12"
                                sm="6"
                                >
                                    <v-list-item>
                                        <v-list-item-content>
                                        <span>Дата начала</span><br>
                                        <br><v-date-picker v-model="addCurseDateStart"></v-date-picker>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="6"
                                >
                                    <v-list-item>
                                        <v-list-item-content>
                                        <span>Дата окончания</span><br>
                                        <br><v-date-picker v-model="addCurseDateEnd"></v-date-picker>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="5"
                        >
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
                                    label="Превью"
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
                        </v-col>
                    </v-row>
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
                    <v-toolbar-title>Редактирование курса</v-toolbar-title>
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
                    <v-row class="ma-0">
                        <v-col
                        cols="12"
                        sm="7"
                        >
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
                            <v-row>
                                <v-col
                                cols="12"
                                sm="6"
                                >
                                    <v-list-item>
                                        <v-list-item-content>
                                        <v-col
                                        cols="12"
                                        sm="12"
                                        >
                                        <span>Дата начала</span><br>
                                        <br><v-date-picker v-model="editCurseDateStart"></v-date-picker>
                                        </v-col>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="6"
                                >
                                    <v-list-item>
                                        <v-list-item-content>
                                        <v-col
                                        cols="12"
                                        sm="12"
                                        >
                                        <span>Дата окончания</span><br>
                                        <br><v-date-picker v-model="editCurseDateEnd"></v-date-picker>
                                        </v-col>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col
                        cols="12"
                        sm="4"
                        >
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
                                label="Превью"
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
                        </v-col>
                        </v-row>
                    </v-card>
                </v-card>
            </v-dialog>
            <v-dialog
            v-model="showCategories"
            max-width="550"
            transition="dialog-bottom-transition"
            >
            <v-card>
                <v-list
                three-line
                subheader
                >
                <v-list-item>
                    <v-list-item-content>
                        <v-data-table
                            :headers="categoryHeaders"
                            :items="categoryTable"
                            sort-by="calories"
                            class="elevation-1"
                        >
                            <template v-slot:top>
                            <v-toolbar
                                flat
                            >
                                <v-toolbar-title>Категории</v-toolbar-title>
                                <v-divider
                                class="mx-4"
                                inset
                                vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <v-btn
                                tile
                                color="success"
                                @click="toAddCategory"
                                >
                                <v-icon left>
                                    mdi-plus
                                </v-icon>
                                Добавить
                                </v-btn>
                            </v-toolbar>
                            </template>
                            <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                class="mr-2"
                                @click="toEditCategory(item)"
                            >
                                mdi-pencil
                            </v-icon>
                            <v-icon
                                small
                                @click="toDeleteCategory(item)"
                            >
                                mdi-delete
                            </v-icon>
                            </template>
                        </v-data-table>
                    </v-list-item-content>
                </v-list-item>
                </v-list>
            </v-card>
                <v-dialog
                v-model="isDeleteCategory"
                persistent
                max-width="290"
                >
                <v-card>
                    <v-card-title class="text-h5">
                    Удалить {{ deleteCategoryTitle }}?
                    </v-card-title>
                    <v-card-text>Категория будет безвозвратно удалена.</v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="cancelDeleteCategory"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="confirmDeleteCategory"
                    >
                        Хорошо
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
                <v-dialog
                    v-model="isAddCategory"
                    transition="dialog-bottom-transition"
                    max-width="600"
                >
                    <template>
                        <v-card>
                            <v-toolbar
                                flat
                                color="primary"
                                dark
                            >
                                <v-toolbar-title>Новая категория</v-toolbar-title>
                                <v-divider
                                class="mx-4"
                                inset
                                vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <v-btn
                                tile
                                @click="confirmAddCategory"
                                class="mr-8"
                                >
                                <v-icon left>
                                    mdi-plus
                                </v-icon>
                                Добавить
                                </v-btn>
                                <v-btn
                                tile
                                @click="cancelAddCategory"
                                color="error"
                                >
                                <v-icon left>
                                    mdi-trash-can
                                </v-icon>
                                Отмена
                                </v-btn>
                            </v-toolbar>
                            <v-textarea
                            class="ma-7"
                            label="Название"
                            rows="1"
                            v-model="addCategoryTitle"
                            ></v-textarea>
                            <v-col
                            cols="12"
                            sm="5"
                            >
                                <v-file-input
                                ref="imageCategoryAdd"
                                @change="imageUploadCategory"
                                label="Картинка Категории"
                                accept="image/*"
                                ></v-file-input>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="7"
                            >
                                <v-img
                                v-if="addCategoryImagePreview"
                                max-height="178"
                                max-width="284"
                                :src="addCategoryImagePreview"
                                ></v-img>
                            </v-col>
                        </v-card>
                    </template>
                </v-dialog>
            </v-dialog>
            <v-dialog
                transition="dialog-bottom-transition"
                max-width="600"
                v-model="isEditCategory"
            >
                <v-card>
                    <v-toolbar
                    color="primary"
                    dark
                    >Редактирование категории</v-toolbar>
                    <v-card-text>
                        <v-textarea
                            class="ma-7"
                            label="Название"
                            rows="1"
                            v-model="editCategoryTitle"
                            ></v-textarea>
                            <v-col
                            cols="12"
                            sm="5"
                            >
                                <v-file-input
                                ref="imageCategoryEdit"
                                @change="imageUploadCategoryEdit"
                                label="Картинка Категории"
                                accept="image/*"
                                ></v-file-input>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="7"
                            >
                                <v-img
                                v-if="editCategoryImagePreview"
                                max-height="178"
                                max-width="284"
                                :src="editCategoryImagePreview"
                                ></v-img>
                            </v-col>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="confirmEditCategory"
                    >Применить</v-btn>
                    <v-btn
                        text
                        @click="cancelEditCategory"
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
                <v-card-text>Курс будет удален</v-card-text>
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
const base64 = require('base-64')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            trashBtnTitle: "Корзина",
            trashBtnColor: "error",

            rights: [],
            isShowTrashBtn: true,
            isShowCategoryBtn: true,


            // данные курсов на добавление
            isAddCurse: false,
            addCurseTitle: "",
            addCurseProgram: "",
            addCurseTown: "",
            addCurseAddress: "",
            addCurseLector: "",
            addCurseDateStart: new Date(Date.now()).toISOString().substr(0, 10),
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
            addCategoryImagePreview: "",
            addCategoryUniqueSuffix: "",

            // данные категорий на редактирование
            isEditCategory: false,
            editCategoryId: "",
            editCategoryTitle: "",
            editCategoryImage: "",
            editCategoryImagePreview: "",

            // данные категорий на удаление
            isDeleteCategory: false,
            deleteCategoryTitle: "",
            deleteCategoryId: "",

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
                    align: 'end',
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
            this.checkAuth()
            
            this.checkRight()

            this.isAddCurse = true
        },
        async confirmAddCurse() {
            this.checkAuth()

            this.checkRight()

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
            formData.append('educational_center_id', this.$store.getters['eduCenter/getId'])
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
            this.checkAuth()

            this.checkRight()

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

        async toEditCurse(curse) {
            this.checkAuth()

            this.checkRight()

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
                this.editCurseCategories = []
                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/category`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        curse_id: curse.curse_id
                    })
                })
                const data = await result.json()
                for(const cat of data.categories) {
                    this.editCurseCategories.push(cat.title)
                }
            } else {
                this.showEditInTrashError = true
                this.editCurseId = curse.curse_id
            }
        },
        async confirmEditCurse() {
            this.checkAuth()

            this.checkRight()

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
            if(!!this.editCurseImage)
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
            this.checkAuth()

            this.checkRight()

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

            this.isEditCurse = false
        },

        toDeleteCurse(curse) {
            this.checkAuth()

            this.checkRight()

            this.isDeleteCurse = true

            this.deleteCurseId = curse.curse_id
            this.deleteCurseTitle = curse.title
        },
        async confirmDeleteCurse() {
            this.checkAuth()

            this.checkRight()

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
            this.checkAuth()

            this.checkRight()

            this.isDeleteCurse = false
            this.deleteCurseId = ""
            this.deleteCurseTitle = ""
        },
        async confirmReestablishCurse() {
            this.checkRight()

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
            this.checkAuth()

            this.checkRight()

            this.showEditInTrashError = false
        },

        doCategory() {
            this.checkAuth()

            this.checkRight()

            this.showCategories = true
        },

        toAddCategory() {
            this.checkAuth()

            this.checkRight()

            this.isAddCategory = true
            this.addCategoryUniqueSuffix = uuidv4()
        },
        async confirmAddCategory() {
            this.checkAuth()

            this.checkRight()

            let formData = new FormData()

            formData.append('title', this.addCategoryTitle)
            formData.append('uniqueSuffix', this.addCategoryUniqueSuffix)
            formData.append('educational_center_id', this.$store.getters['eduCenter/getId'])
            formData.append('image', this.addCategoryImage, this.addCategoryImage.name)

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/category/add`, {
                method: "POST",
                headers: {
                    // 'Content-Type': 'multipart/form-data;boundary=MyBoundary'
                    // 'Content-Type': 'application/json;charset=utf-8'
                },
                body: formData
            })

            const data = await result.json()
            this.categoryTable.push(data.aCategory)
            this.categories.push(data.aCategory.title)

            this.isAddCategory = false
        },
        cancelAddCategory() {
            this.checkAuth()

            this.checkRight()

            this.isAddCategory = false
        },

        toEditCategory(category) {
            this.checkAuth()

            this.checkRight()

            this.isEditCategory = true

            this.editCategoryId = category.category_id
            this.editCategoryImagePreview = category.image
            this.editCategoryTitle = category.title
            this.editCategoryUniqueSuffix = uuidv4()
        },
        async confirmEditCategory() {
            this.checkAuth()

            this.checkRight()

            let formData = new FormData()

            formData.append('title', this.editCategoryTitle)
            formData.append('uniqueSuffix', this.editCategoryUniqueSuffix)
            formData.append('category_id', this.editCategoryId)
            if(!!this.editCategoryImage) {
                formData.append('image', this.editCategoryImage, this.editCategoryImage.name)
            }

            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/category/edit`, {
                method: "PUT",
                headers: {
                    // 'Content-Type': 'multipart/form-data;boundary=MyBoundary'
                    // 'Content-Type': 'application/json;charset=utf-8'
                },
                body: formData
            })
            this.getAllData()

            this.isEditCategory = false
        },
        cancelEditCategory() {
            this.checkAuth()

            this.checkRight()

            this.isEditCategory = false

            this.editCategoryId = ""
            this.editCategoryImagePreview = ""
            this.editCategoryTitle = ""
        },

        toDeleteCategory(category) {
            this.checkAuth()

            this.checkRight()

            this.isDeleteCategory = true

            this.deleteCategoryTitle = category.title
            this.deleteCategoryId = category.category_id
        },
        async confirmDeleteCategory() {
            this.checkAuth()

            this.checkRight()

            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses/category`, {
                method: "DELETE", 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    category_id: this.deleteCategoryId
                })
            })

            this.getAllData()
            this.isDeleteCategory = false
        },
        cancelDeleteCategory() {
            this.checkAuth()

            this.checkRight()

            this.isDeleteCategory = false

            this.deleteCategoryTitle = ""
            this.deleteCategoryId = ""
        },

        async getAllData() {
            this.checkAuth()

            this.checkRight()

            const educational_center_id = this.$store.getters['eduCenter/getId']

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/curses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    educational_center_id: educational_center_id
                })
            })
            const data = await result.json()
            this.curseTable = data.curses
            this.categoryTable = data.categories
            this.trashTable = data.trashedCurses

            this.categories = []
            this.categoryTable.forEach(cat => {
                this.categories.push(cat.title)
            })
        },
        
        fileUpload() {
            this.checkAuth()

            this.checkRight()

            const filename = this.$refs.imageCurse.$refs.input.files
            if (filename.length) {
                this.addCurseImage = filename[0]
                this.addCurseUniqueSuffix = uuidv4()

                this.addCurseImagePreview = URL.createObjectURL(filename[0])
            } else {
                this.addCurseImage = ""

                this.addCurseImagePreview = ""
            }
        },
        fileUploadEdit() {
            this.checkAuth()

            this.checkRight()

            const filename = this.$refs.imageCurseEdit.$refs.input.files
            if (filename.length) {
                this.editCurseImage = filename[0]
                this.editCurseUniqueSuffix = uuidv4()

                this.editCurseImagePreview = URL.createObjectURL(filename[0])
            } else {
                this.editCurseImage = ""

                this.editCurseImagePreview = ""
            }
        },
        imageUploadCategory() {
            this.checkAuth()

            this.checkRight()

            const filename = this.$refs.imageCategoryAdd.$refs.input.files
            if(filename.length) {
                this.addCategoryImage = filename[0]

                this.addCategoryImagePreview = URL.createObjectURL(filename[0])
            } else {
                this.addCategoryImage = ""

                this.addCategoryImagePreview = ""
            }
        },
        imageUploadCategoryEdit() {
            this.checkAuth()

            this.checkRight()

            const filename = this.$refs.imageCategoryEdit.$refs.input.files
            if(filename.length) {
                this.editCategoryImage = filename[0]

                this.editCategoryImagePreview = URL.createObjectURL(filename[0])
            } else {
                this.editCategoryImage = ""

                this.editCategoryImagePreview = ""
            }
        },
        checkRight() {
            if(!this.rights.includes('ec_access_curse')) {
                this.$router.go(-1)
            }
        },
        async checkAuth() {
            if(this.$store.getters['eduCenter/getTokens'].refresh) {
                const refresh = this.$store.getters['eduCenter/getTokens'].refresh
                const payload = JSON.parse(base64.decode(this.$store.getters['eduCenter/getTokens'].access.split('.')[1]))

                if(Math.ceil(Date.now()/1000) >= +payload.exp - 8) {
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
    async beforeMount() {
        this.$store.commit('eduCenter/syncState')

        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/accesses`, {
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

        if(!this.rights.includes('ec_access_category')) {
            this.isShowCategoryBtn = false
        }

        if(!this.rights.includes('ec_access_trash')) {
            this.isShowTrashBtn = false
        }

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
    },
    beforeDestroy() {
        this.$store.commit('eduCenter/saveState')
    }
}
</script>

<style scoped>
</style>