<template>
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
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ programm.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card>
            <v-img
                max-height="250"
                max-width="250"
                :src="programm.image"
            ></v-img>
            <p>Город проведения: {{ programm.town }}, лектор(ы): {{ programm.lector }}</p>
            <p>Дата начала: {{ programm.date_start }}, Дата завершения: {{ programm.date_end }}</p>
            <p>Цена: {{ programm.price }}p , баллы: {{ programm.score }}</p>
            <p>{{ programm.program }}</p>
        </v-card>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ProgrammCurse",
    props: [ 'programm', 'isShow' ],
    data() {
        return {

        }
    },
    methods: {
        close() {
            this.$emit('close')
        }
    },
}
</script>

<style scoped>

</style>