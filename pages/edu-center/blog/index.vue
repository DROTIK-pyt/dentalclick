<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <h2 class="mb-8 mr-10 float-left">Статьи</h2>
            <v-btn
            fab
            dark
            color="indigo"
            @click="addArticle"
            >
            <v-icon dark>
                mdi-plus
            </v-icon>
            </v-btn>
            <br><br>
            <v-data-table
                :headers="headers"
                :items="desserts"
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
                    @click="isEdit = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Редактирование статьи</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn
                    dark
                    text
                    @click="dialog = false"
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
                    @click="isAdd = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Добавление статьи</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn
                    dark
                    text
                    @click="dialog = false"
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
                <v-card-text>Статья будет перемещена в корзину и не будет видна на сайте.</v-card-text>
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
        </v-col>
    </div>
</template>

<script>
export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            isEdit: false,
            isDelete: false,
            isAdd: false,
            titleArticle: "",
            descriptionArticle: "",
            deletingTitle: "",
            deletingId: 0,

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
            desserts: [
                {
                    id: 1,
                    title: "title1",
                    description: "descr1"
                }
            ],
            
        }
    },
    methods: {
        editItem(item) {
            this.isEdit = true
            console.log(item)
        },
        deleteItem(item) {
            this.isDelete = true
            this.deletingId = item.id
        },
        confirmDelete() {
            this.isDelete = false
        },
        cancelDelete() {
            this.isDelete = false
            this.deletingId = null
            this.deletingTitle = ""
        },
        async addArticle() {
            this.isAdd = true
            const result = await fetch('http://localhost:8888/edu-center/blog/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
        }
    },
}
</script>

<style scoped>

</style>