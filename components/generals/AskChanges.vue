<template>
    <v-dialog
      v-model="isShow"
      persistent
      max-width="320"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="$emit('no')"
          >
            Отмена
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('yes')"
          >
            Принять
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "AskChanges",
    props: [ 'title', 'text', 'isShow' ],
    data() {
        return {

        }
    },
}
</script>

<style scoped>

</style>