<template>
    <v-dialog
      v-model="isError"
      persistent
      max-width="350"
    >
      <v-card>
        <v-card-title class="text-h5">
          Что-то пошло не так...
        </v-card-title>
        <v-card-text>
            Пожалуйста, заполните все поля и проверьте их правильность перед отправкой. Спасибо.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="$emit('close')"
          >
            Хорошо
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ErrorSended",
    props: [ 'isError' ],
    data() {
        return {}
    },
}
</script>

<style scoped>

</style>