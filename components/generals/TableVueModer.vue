<template>
    <v-card>
        <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск.."
            single-line
            hide-details
        ></v-text-field>
        </v-card-title>
        <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        items-per-page="5"
        >
        <template v-slot:item.currType="{ item }">
            <span v-if='JSON.parse(item.new_information).type === "doctor"'>
                Доктор: {{ JSON.parse(item.new_information).newInfo.name }}
            </span>
            <span v-if='JSON.parse(item.new_information).type === "eduCenter"'>
                Центр: {{ JSON.parse(item.new_information).newInfo.title }}
            </span>
            <span v-if='JSON.parse(item.new_information).type === "doctor-change-accesses"'>
                {{ JSON.parse(item.new_information).newInfo.text }} (Доктор)
            </span>
            <span v-if='JSON.parse(item.new_information).type === "edu-center-change-accesses"'>
                {{ JSON.parse(item.new_information).newInfo.text }} (Центр)
            </span>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="$emit('editItem', {...JSON.parse(item.new_information), moderation_id: item.moderation_id})"
        >
            mdi-eye
        </v-icon>
        </template>
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    name: "TableVueModer",
    props: [ 'headers', 'items', 'title' ],
    data() {
        return {
            search: "",
        }
    },
}
</script>

<style scoped>

</style>