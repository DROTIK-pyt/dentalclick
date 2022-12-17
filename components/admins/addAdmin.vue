<template>
    <v-dialog
      v-model="isAdding"
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
            @click="$emit('closeAdd')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Новый администратор</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="addAdmin"
            >
              Сохранить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Об админе</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Действующая почта</v-list-item-title>
              <v-text-field
                label="E-mail"
                placeholder="Почта"
                outlined
                v-model="email"
                :error-messages="msgErrorAdding"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Права доступа</v-list-item-title>
              <v-select
                v-model="selectedRights"
                :items="allRights"
                :menu-props="{ maxHeight: '250' }"
                label="Права доступа"
                multiple
              ></v-select>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
  props: ["isAdding",],
  data: () => ({
      email: "",
      selectedRights: [],
      allRights: [],
      msgErrorAdding: "",
  }),
  methods: {
    async addAdmin() {
      const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin/add`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
              email: this.email,
              rights: this.selectedRights
          })
      })
      const responsed = await result.json()

      if(responsed.ok) {
        this.$emit('addAdmin')
      } else {
        this.msgErrorAdding = responsed.msg
      }
    }
  },
  async beforeMount() {
    const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin/get/rights`)
    const responsed = await result.json()

    let arrayRights = Object.values(responsed)
    arrayRights = arrayRights.filter(right => right.indexOf('admin') > -1)
    this.allRights = arrayRights
  }
}
</script>