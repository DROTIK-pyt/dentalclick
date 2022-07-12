<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <v-data-table
                :headers="curseHeaders"
                :items="curseTable"
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
        </v-col>
    </div>
</template>

<script>
export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            // данные курсов на добавление
            isAddCurse: false,

            // данные курсов на редактирование
            isEditCurse: false,

            // данные курсов на удаление
            isDeleteCurse: false,


            // данные категорий на добавление
            isAddCategory: false,

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
                // ...
            ],
            curseTable: [],

            categoryHeaders: [
                {
                    text: 'Название',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                // ...
            ],
            categoryTable: [],
        }
    },
    methods: {
        toAddCurse(curse) {},
        confirmAddCurse() {},
        cancelAddCurse() {},

        toEditCurse(curse) {},
        confirmEditCurse() {},
        cancelEditCurse() {},

        toDeleteCurse(curse) {},
        confirmDeleteCurse() {},
        cancelDeleteCurse() {},

        doCategory() {},

        toAddCategory(category) {},
        confirmAddCategory() {},
        cancelAddCategory() {},

        toEditCategory(category) {},
        confirmEditCategory() {},
        cancelEditCategory() {},

        toDeleteCategory(category) {},
        confirmDeleteCategory() {},
        cancelDeleteCategory() {},

        getAllData() {}
    },
}
</script>

<style scoped>

</style>