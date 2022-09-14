<template>
    <v-data-table
        :headers="curseHeaders"
        :items="curses"
        :search="searchCurse"
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
                md="12"
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
            </v-row>
        </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            @click='$emit("showProgramm", item.curse_id)'
        >
            mdi-eye
        </v-icon>
        </template>
</v-data-table>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')

export default {
    name: "TableCurses",
    props: [ 'searchCurse', 'curseHeaders', 'curses' ],
    data() {
        return {}
    },
    methods: {}
}
</script>