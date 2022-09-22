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
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="$emit('save')"
            >
              Сохранить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row>
            <v-col
            cols="12"
            sm="6"
            >

            </v-col>
            <v-col
            cols="12"
            sm="6"
            >

            </v-col>
        </v-row>    
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ViewCenter',
    props: [ 'title', 'isShow', 'center' ]
}
</script>

<style scoped>

</style>