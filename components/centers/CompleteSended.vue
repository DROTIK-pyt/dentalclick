<template>
    <v-dialog
      v-model="isSended"
      persistent
      max-width="350"
    >
      <v-card>
        <v-card-title class="text-h5">
          Данные успешно отправленны на рассмотрение
        </v-card-title>
        <v-card-text>
            Данные успешно отправленны на рассмотрение.
            Вам скоро на почту придет уведомление с номером заявки
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="isSended = false"
          >
            Хорошо
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "CompleteSended",
    props: [ 'isSended' ],
    data() {
        return {}
    },
}
</script>

<style scoped>

</style>