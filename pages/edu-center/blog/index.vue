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
                    @click="isAddRubric = true"
                    small
                    class="white--text"
                    >
                    <v-icon left>
                        mdi-pencil
                    </v-icon>
                    Добавить рубрику
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
        </v-col>
    </div>
</template>

<script>
const baseSettings = require('../../../server/config/serverSetting.json')

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
            this.isDelete = false
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
        cancelDelete() {
            // ничего не делаем
            this.isDelete = false
            this.deletingId = null
            this.deletingTitle = ""
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
            this.newRubric = ""
            this.isAddRubric = false
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
        }
    },
    async beforeMount() {
        this.getAllBlog()
    }
}
</script>

<style scoped>

</style>