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
            @click="$emit('close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ programm.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="pa-4">
          <v-img
              max-height="250"
              max-width="250"
              :src="programm.image"
          ></v-img>
          <v-btn
            depressed
            color="primary"
            class="my-2"
            @click="toSubscribeUnsubscribe(programm.curse_id)"
          >
            {{ textBtn }}
          </v-btn>
          <p>Город проведения: {{ programm.town }}, лектор(ы): {{ programm.lector }}</p>
          <p>Дата начала: {{ programm.date_start }}, Дата завершения: {{ programm.date_end }}</p>
          <p>Цена: {{ programm.price }}p , баллы: {{ programm.score }}</p>
          <p>{{ programm.program }}</p>
        </div>
      </v-card>
    </v-dialog>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')

export default {
    name: "ProgrammCurse",
    props: [ 'programm', 'isShow' ],
    data() {
        return {}
    },
    methods: {
      async toSubscribeUnsubscribe(curse_id) {
        if(!this.programm.isSubscribed) {
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
              this.programm.isSubscribed = true
        } else {
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
            this.programm.isSubscribed = false
        }
      },
    },
    computed: {
      textBtn() {
        return this.programm.isSubscribed ? "Отписаться" : "Подписаться на курс"
      }
    }
}
</script>

<style scoped>

</style>