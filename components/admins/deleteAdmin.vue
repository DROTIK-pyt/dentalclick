<template>
    <v-dialog
      v-model="isDelete"
      persistent
      max-width="390"
    >
      <v-card>
        <v-card-title class="text-h5">
          Действительно удалить?
        </v-card-title>
        <v-card-text>После удаления администратор не сможет вносить изменения и лишится прав доступа.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="cancelDelete"
          >
            Отмена
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="deleteAdmin"
          >
            Принять
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['isDelete'],
    data: () => ({

    }),
    methods: {
        cancelDelete() {
            this.$emit("deleting", false)
        },
        deleteAdmin() {
            this.$emit("deleting", true)
        },
    }
}
</script>

<style scoped>

</style>