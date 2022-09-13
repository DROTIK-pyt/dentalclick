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
            class="mr-2"
            v-if="!item.isSubscribed"
            @click="toSubscribeOnCurse(item.curse_id)"
        >
            mdi-playlist-check
        </v-icon>
        <v-icon
            small
            class="mr-2"
            v-else
            @click="toUnSubscribeOnCurse(item.curse_id)"
        >
            mdi-playlist-remove
        </v-icon>
        <v-icon
            small
            @click="toShowCurseProgramm(item.curse_id)"
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
        return {

        }
    },
    methods: {
        toSubscribeOnCurse(curse_id) {
            this.curses.forEach(async curse => {
                if (curse_id === curse.curse_id) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/subscribe`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            curse_id: curse_id,
                            doctor_id: this.$store.getters['doctors/getId'],
                        })
                    })
                    const response = await result.json()
                    if(response.ok)
                        curse.isSubscribed = true
                }
            })
        },
        toUnSubscribeOnCurse(curse_id) {
            console.log('toUnSubscribeOnCurse')
            this.curses.forEach(async curse => {
                if (curse_id === curse.curse_id) {
                    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/unsubscribe`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({
                            curse_id: curse_id,
                            doctor_id: this.$store.getters['doctors/getId'],
                        })
                    })
                    const response = await result.json()
                    if(response.ok)
                        curse.isSubscribed = false
                }
            })
        },
        toShowCurseProgramm(curse_id) {
            this.$emit("showProgramm", curse_id)
        },
    }
}
</script>