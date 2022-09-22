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
        >
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="$emit('editItem', item)"
        >
            mdi-eye
        </v-icon>
        </template>
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    name: "TableVue",
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