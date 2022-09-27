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
                                    v-model="editCurseItem.title"
                                ></v-text-field>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-textarea
                                name="input-7-1"
                                label="Программа курса"
                                rows="5"
                                row-height="20"
                                v-model="editCurseItem.program"
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
                                        <br><v-date-picker v-model="editCurseItem.date_start"></v-date-picker>
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
                                        <br><v-date-picker v-model="editCurseItem.date_end"></v-date-picker>
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
                                v-model="editCurseItem.town"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="Адрес проведения"
                                v-model="editCurseItem.address"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="ФИО лектора(ов)"
                                v-model="editCurseItem.lector"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="Цена"
                                v-model="editCurseItem.price"
                            ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                            <v-text-field
                                label="Баллы"
                                v-model="editCurseItem.score"
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
                </v-list-item-content>
            </v-list-item>
            </v-list>
        </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    name: "EditCurse",
    props: [ 'titleCurse', 'isShow', 'curse' ],
    data() {
        return {
            editCurseItem: {},
            editCurseImage: "",
            editCurseImagePreview: "",
            editCurseUniqueSuffix: "",

            editCurseCategories: [],
            categories: [],
            cats2id: {}, // title -> curse_id

            resultCategoryIds: []
        }
    },
    methods: {
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
            this.editCurseCategories.forEach(cat => {
                this.resultCategoryIds.push(this.cats2id[cat])
            })

            this.resultCategoryIds = [...new Set(this.resultCategoryIds)]
            this.$emit('saveCurseItem', {curse: this.editCurse, image: {src: this.editCurseImage, suffix: this.editCurseUniqueSuffix}, catIds: this.resultCategoryIds})
        }
    },
    async beforeMount() {
        this.editCurseItem = this.curse || {}
        if(this.editCurseItem) {
            return
        }

        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/curse-categories`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                curse_id: curse.curse_id
            })
        })
        const responsed = result.json()
        if(responsed.ok) {
            this.categories = responsed.nameCats
            this.cats2id = responsed.cats2id
            this.resultCategoryIds = catIds
        }
    }
}
</script>