<template>
    <v-row>
        <v-dialog
        v-model="isShow"
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
                @click="$emit('close')"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Редактирование {{ titleCurse }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn
                dark
                text
                @click="saveCurse"
                v-if="isAdmin && canEdit"
                >
                Сохранить изменения
                </v-btn>
            </v-toolbar-items>
            </v-toolbar>
            <v-list
            three-line
            subheader
            >
            <v-subheader>Данные курса</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <v-col
                        cols="12"
                        sm="7"
                        >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-text-field
                                    label="Название"
                                    v-model="aCurse.title"
                                    :readonly="isAdmin && !canEdit"
                                ></v-text-field>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-textarea
                                name="input-7-1"
                                label="Программа курса"
                                rows="5"
                                row-height="20"
                                v-model="aCurse.program"
                                :readonly="isAdmin && !canEdit"
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
                                        <br><v-date-picker :readonly="isAdmin && !canEdit" v-model="aCurse.date_start"></v-date-picker>
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
                                        <br><v-date-picker :readonly="isAdmin && !canEdit" v-model="aCurse.date_end"></v-date-picker>
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
                                v-model="aCurse.town"
                                :readonly="isAdmin && !canEdit"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="Адрес проведения"
                                v-model="aCurse.address"
                                :readonly="isAdmin && !canEdit"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="ФИО лектора(ов)"
                                v-model="aCurse.lector"
                                :readonly="isAdmin && !canEdit"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="Цена"
                                v-model="aCurse.price"
                                :readonly="isAdmin && !canEdit"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="Баллы"
                                v-model="aCurse.score"
                                :readonly="isAdmin && !canEdit"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-col
                            cols="12"
                            sm="6"
                            >
                                <v-select
                                    v-model="editCategoryItems"
                                    :items="allCategoryItem"
                                    attach
                                    chips
                                    label="Категории"
                                    multiple
                                    :readonly="isAdmin && !canEdit"
                                ></v-select>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="6"
                            >
                                <v-select
                                    v-model="currentStatus"
                                    :items="itemStatuses"
                                    label="Статус"
                                    solo
                                    :readonly="isAdmin && !canEdit"
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
                                v-if="isAdmin && canEdit"
                                ></v-file-input>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="9"
                            >
                            <v-img
                            v-if="aCurse.image && !editCurseImagePreview"
                            max-height="178"
                            max-width="284"
                            :src="aCurse.image"
                            ></v-img>
                            <v-img
                            v-else
                            max-height="178"
                            max-width="284"
                            :src="editCurseImagePreview"
                            ></v-img>
                            </v-col>
                        </v-list-item>
                        </v-col>
                </v-list-item-content>
            </v-list-item>
            </v-list>
        </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const { v4: uuidv4 } = require('uuid')

export default {
    name: "EditCurse",
    props: [ 'titleCurse', 'isShow', 'aCurse', 'categoryItems', 'cat2idItems', 'allCategoryItem', 'statusCurse' ],
    data() {
        return {
            editCurseImage: "",
            editCategoryItems: "",
            editCurseImagePreview: "",
            editCurseUniqueSuffix: "",

            currentStatus: "",
            itemStatuses:  [ "Опубликован", "В корзине" ],

            idStatus2title: {
                1: "Опубликован",
                2: "В корзине"
            },

            statusTitle2id: {
                "Опубликован": 1,
                "В корзине": 2
            },

            resultCategoryIds: [],

            isAdmin: false,
            canEdit: false
        }
    },
    methods: {
        async checkAccesses() {
            if(this.$store.getters['admins/getId']) {
                this.isAdmin = true
                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        admin_id: this.$store.getters['admins/getId']
                    })
                })
                const {accessRights} = await result.json()

                let rights = []
                for(const accessRight of accessRights) {
                    rights.push(accessRight.type)
                }

                this.canEdit = rights.includes('admin_edit_curse')
            }
        },
        fileUploadEdit() {
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
        saveCurse() {

            this.editCategoryItems.forEach(cat => {
                this.resultCategoryIds.push(this.cat2idItems[cat]) // title -> curse_id
            })

            this.resultCategoryIds = [...new Set(this.resultCategoryIds)]
            const result = {curse: this.aCurse, image: {src: this.editCurseImage, suffix: this.editCurseUniqueSuffix}, catIds: this.resultCategoryIds, status_id: this.statusTitle2id[this.currentStatus]}
            this.$emit('saveCurseItem', result)
        }
    },
    computed: {
        async checkEditCurse() {
            if(this.$store.getters['admins/getId']) {

                const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    admin_id: this.$store.getters['admins/getId']
                })
                })
                const {accessRights} = await result.json()

                let rights = []
                for(const accessRight of accessRights) {
                rights.push(accessRight.type)
                }

                return rights.includes('admin_edit_curse')
            }
            return true
        },
    },
    async beforeMount() {
        this.editCategoryItems = this.categoryItems
        this.currentStatus = this.idStatus2title[this.statusCurse.status_id]

        if(this.$store.getters['admins/getId']) {
            this.isAdmin = true

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    admin_id: this.$store.getters['admins/getId']
                })
            })
            const {accessRights} = await result.json()

            let rights = []
            for(const accessRight of accessRights) {
                rights.push(accessRight.type)
            }

            if(rights.includes('admin_edit_center')) {
                this.canEdit = true
            }

            if(rights.includes('admin_remove_center')) {
                this.canRemove = true
            }
        }
    }
}
</script>