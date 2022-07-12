<template>
    <div>
        <v-col
        cols="12"
        sm="9"
        >
            <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                v-model="date"
                label="Birthday date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                :active-picker.sync="activePicker"
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
            ></v-date-picker>
            </v-menu>
        </v-col>
    </div>
</template>

<script>
export default {
    layout: 'Profile',
    middleware: 'eduCheckAuth',
    data() {
        return {
            picker: null
        }
    },
    methods: {
        
    },
}
</script>

<style scoped>

</style>