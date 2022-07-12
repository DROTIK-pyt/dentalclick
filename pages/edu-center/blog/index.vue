<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <h2 class="mb-8 mr-10 float-left">Статьи</h2>
            <div class="wrapper d-flex justify-space-between align-center">
                <div class="left">
                    <v-btn
                    fab
                    dark
                    color="indigo"
                    @click="isAdd = true"
                    >
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                    </v-btn>
                    <v-btn
                    tile
                    color="indigo"
                    @click="doRubrics"
                    small
                    class="white--text"
                    >
                    <v-icon left>
                        mdi-view-list
                    </v-icon>
                    Рубрики
                    </v-btn>
                </div>
                <div class="right">
                    
                </div>
            </div>
            <br><br>
            <v-data-table
                :headers="headers"
                :items="articles"
                sort-by="calories"
                class="elevation-1"
            >
            <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
            </template>
            </v-data-table>
            <v-dialog
            v-model="isEdit"
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
                    @click="cancelEditArticle"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Редактирование статьи</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn
                    dark
                    text
                    @click="saveArticle"
                    >
                    Сохранить
                    </v-btn>
                </v-toolbar-items>
                </v-toolbar>
                <v-list
                three-line
                subheader
                >
                <v-subheader>Статья</v-subheader>
                <v-list-item>
                    <v-list-item-content>
                    <v-list-item-title>Название статьи</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-textarea
                        name="input-7-1"
                        filled
                        label="Название статьи"
                        auto-grow
                        row-height="7"
                        row="1"
                        v-model="titleArticle"
                        ></v-textarea>
                    </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                    <v-list-item-title>Описание</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-textarea
                        name="input-7-1"
                        filled
                        label="Описание"
                        auto-grow
                        row-height="20"
                        row="1"
                        v-model="descriptionArticle"
                        ></v-textarea>
                    </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                </v-list>
                <v-col
                cols="12"
                sm="7"
                >
                    <v-select
                        v-model="editRubrics"
                        :items="items"
                        attach
                        chips
                        label="Рубрики"
                        multiple
                    ></v-select>
                </v-col>
            </v-card>
            </v-dialog>
            <v-dialog
            v-model="isAdd"
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
                    @click="cancelAddArticle"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Добавление статьи</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn
                    dark
                    text
                    @click="addArticle"
                    >
                    Сохранить
                    </v-btn>
                </v-toolbar-items>
                </v-toolbar>
                <v-list
                three-line
                subheader
                >
                <v-subheader>Статья</v-subheader>
                <v-list-item>
                    <v-list-item-content>
                    <v-list-item-title>Название статьи</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-textarea
                        name="input-7-1"
                        filled
                        label="Название статьи"
                        auto-grow
                        row-height="7"
                        row="1"
                        v-model="titleArticle"
                        ></v-textarea>
                    </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                    <v-list-item-title>Описание</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-textarea
                        name="input-7-1"
                        filled
                        label="Описание"
                        auto-grow
                        row-height="20"
                        row="1"
                        v-model="descriptionArticle"
                        ></v-textarea>
                    </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                </v-list>
                <v-col
                cols="12"
                sm="7"
                >
                    <v-select
                        v-model="addRubrics"
                        :items="items"
                        attach
                        chips
                        label="Рубрики"
                        multiple
                    ></v-select>
                </v-col>
            </v-card>
            </v-dialog>
            <v-dialog
            v-model="isDelete"
            persistent
            max-width="290"
            >
            <v-card>
                <v-card-title class="text-h5">
                Удалить {{ deletingTitle }}?
                </v-card-title>
                <v-card-text>Статья будет безвозвратна удалена.</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="cancelDelete"
                >
                    Отмена
                </v-btn>
                <v-btn
                    color="green darken-1"
                    text
                    @click="confirmDelete"
                >
                    Хорошо
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog
                transition="dialog-bottom-transition"
                max-width="500"
                v-model="isAddRubric"
            >
                <template>
                <v-card>
                    <v-toolbar
                    color="primary"
                    dark
                    >Добавление рубрики</v-toolbar>
                    <v-card-text>
                        <br>
                        <br>
                        <v-textarea
                        name="input-7-1"
                        filled
                        label="Название рубрики"
                        auto-grow
                        row-height="8"
                        rows="1"
                        v-model="newRubric"
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="isAddRubric = false"
                    >Отмена</v-btn>
                    <v-btn
                        text
                        @click="addRubric"
                    >Добавить</v-btn>
                    </v-card-actions>
                </v-card>
                </template>
            </v-dialog>
            <v-dialog
            v-model="isDoRubrics"
            width="500"
            >
                <v-data-table
                    :headers="rubricHeaders"
                    :items="rubricTable"
                    sort-by="calories"
                    class="elevation-1"
                >
                    <template v-slot:top>
                        <v-toolbar
                            flat
                        >
                            <v-btn
                            depressed
                            color="primary"
                            @click="toAddRubric"
                            >
                            Добавить рубрику
                            </v-btn>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="toEditRubric(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        small
                        @click="toDeleteRubric(item)"
                    >
                        mdi-delete
                    </v-icon>
                    </template>
                </v-data-table>
                <v-dialog
                v-model="isDeleteRubric"
                persistent
                max-width="290"
                >
                <v-card>
                    <v-card-title class="text-h5">
                    Удалить {{ deleteRubricTitle }}?
                    </v-card-title>
                    <v-card-text>Рубрика будет безвозвратна удалена.</v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="cancelDeleteRubric"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="confirmDeleteRubric"
                    >
                        Хорошо
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
                <v-dialog
                v-model="isEditRubric"
                persistent
                max-width="390"
                >
                <v-card>
                    <v-card-title class="text-h5">
                    Редактировать рубрику
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <br>
                        <v-textarea
                        name="input-7-1"
                        filled
                        label="Название рубрики"
                        auto-grow
                        row-height="8"
                        rows="1"
                        v-model="editRubricTitle"
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="isEditRubric = false"
                    >Отмена</v-btn>
                    <v-btn
                        text
                        @click="editRubric"
                    >Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-dialog>
        </v-col>
    </div>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting')

export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            isEdit: false,
            isDelete: false,
            isAdd: false,
            isAddRubric: false,
            titleArticle: "",
            descriptionArticle: "",
            deletingTitle: "",
            deletingId: 0,
            editingId: 0,
            newRubric: "",
            items: [],
            addRubrics: [],
            editRubrics: [],
            editRubricId: 0,
            editRubricTitle: null,
            isDoRubrics: false,
            isEditRubric: false,
            isDeleteRubric: false,
            deleteRubricTitle: null,
            deleteRubricId: 0,

            rubricHeaders: [
                {
                text: 'Название рубрики',
                align: 'start',
                value: 'title',
                },
                { text: 'Действия', value: 'actions' },
            ],
            rubricTable: [],

            headers: [
                {
                text: 'Название статьи',
                align: 'start',
                value: 'title',
                },
                { text: 'Описание', value: 'description' },
                { text: 'Дата добавления', value: 'createdAt' },
                { text: 'Дата изменения', value: 'updatedAt' },
                { text: 'Действия', value: 'actions' },
            ],
            articles: [],
            
        }
    },
    methods: {
        async editItem(item) {
            this.titleArticle = item.title
            this.descriptionArticle = item.description
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/rubrics`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({articles_id: item.articles_id})
            })
            const rubrics = await result.json()
            this.editRubrics = []
            rubrics.rubrics.forEach(rub => {
                this.editRubrics.push(rub.title)
            })
            this.editingId = item.articles_id

            this.isEdit = true           
        },
        deleteItem(item) {
            this.deletingTitle = item.title
            this.deletingId = item.articles_id
            this.isDelete = true
        },
        async confirmDelete() {
            // удаляем
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({articles_id: this.deletingId})
            })
            this.articles.filter(article => article.articles_id != this.deletingId)

            this.deletingId = null
            this.deletingTitle = ""
            this.getAllBlog()
            this.isDelete = false
        },
        toDeleteRubric(item) {
            this.isDeleteRubric = true
            this.deleteRubricId = item.rubrics_id
            this.deleteRubricTitle = item.title
        },
        toEditRubric(item) {
            this.isEditRubric = true
            this.editRubricId = item.rubrics_id
            this.editRubricTitle = item.title
        },
        async confirmDeleteRubric() {
            this.isDeleteRubric = false
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/rubrics`, {
                method: "DELETE",
                 headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({rubrics_id: this.deleteRubricId})
            })
            this.items = this.items.filter(rubric => rubric != this.deleteRubricTitle)
            this.rubricTable = this.rubricTable.filter(rubric => rubric.title != this.deleteRubricTitle)
        },
        cancelDelete() {
            // ничего не делаем
            this.isDelete = false
            this.deletingId = null
            this.deletingTitle = ""
        },
        cancelDeleteRubric() {
            this.isDeleteRubric = false
            this.deleteRubricId = 0
            this.deleteRubricTitle = ""
        },
        async addArticle() {
            this.isAdd = true
            const newArticle = {
                title: this.titleArticle,
                description: this.descriptionArticle,
                rubrics: this.addRubrics
            }
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/add`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newArticle)
            })
            const article = await result.json()
            this.articles.push(article.article)
            this.isAdd = false
        },
        viewTrash() {
            this.$router.push({path: "trash"})
        },
        cancelAddArticle() {
            this.titleArticle = ""
            this.descriptionArticle = ""
            this.isAdd = false
        },
        cancelEditArticle() {
            this.titleArticle = ""
            this.descriptionArticle = ""
            this.isEdit = false
        },
        toAddRubric() {
            this.isAddRubric = true
        },
        async addRubric() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/rubrics/add`, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({title: this.newRubric})
            })
            const rub = await result.json()
            this.items.push(rub.rubric.title)
            this.rubricTable.push({
                title: rub.rubric.title,
                rubrics_id: rub.rubric.rubrics_id
            })
            this.newRubric = ""
            this.isAddRubric = false
        },
        async editRubric() {
            const title = this.editRubricTitle
            const rubrics_id = this.editRubricId
            console.log({title: title, rubrics_id: rubrics_id})

            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/rubrics/edit`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({title: title, rubrics_id: rubrics_id})
            })
            const data = await result.json()
            this.rubricTable = data.rubric
            this.items = []
            data.rubric.forEach(rub => {
                this.items.push(rub.title)
            })

            this.getAllBlog()
            this.isEditRubric = false
        },
        async saveArticle() {
            const editArticle = {
                articles_id: this.editingId,
                rubrics: this.editRubrics,
                description: this.descriptionArticle,
                title: this.titleArticle,
            }
            await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/edit`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(editArticle)
            })
            this.isEdit = false
        },
        async getAllBlog() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog`)
            const data = await result.json()
            
            data.blogRubrics.forEach(rub => {
                this.items.push(rub.title)
            })
            this.articles = data.blogArticles
        },
        async doRubrics() {
            this.isDoRubrics = true
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/edu-center/blog/rubrics`)
            const data = await result.json()

            this.rubricTable = data.result
        }
    }, 
    async beforeMount() {
        this.getAllBlog()
    }
}
</script>

<style scoped>

</style>