<template>
    <v-dialog
      v-model="isEdit"
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
            @click="closeEdit"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Редактировать администратора</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="saveAdmin"
            >
              Сохранить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Данные</v-subheader>
          <v-list-item>
            <v-text-field
              label="E-mail"
              placeholder="Почта"
              outlined
              v-model="admin.login"
              :error-messages="msgErrorEdit"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-btn
            depressed
            color="error"
            @click="regeneratePassword"
            >
                Перегенерировать пароль
            </v-btn>
            <p>
                {{ msg[currentType] }}
            </p>
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
    props: ['admin', 'isEdit'],
    data: () => ({
        msg: {
            success: "Пароль успешно изменен.",
            failure: "Что-то пошло не так..",
            empty: "",
        },
        typesMsg: {
            success: "success",
            failure: "failure",
            empty: "empty",
        },
        currentType: "empty",
        msgErrorEdit: "",

        selectedRights: [],
        allRights: [],
    }),
    methods: {
      closeEdit() {
        this.$emit('closeEdit')
      },
      async saveAdmin() {
        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
              newEmail: this.admin.login,
              admin_id: this.admin.admin_id,
              rights: this.selectedRights
            })
        })
        const responsed = await result.json()
        if(responsed.ok) {
          this.$emit('saveAdmin')
        } else {
          this.msgErrorEdit = responsed.msg
        }
      },
      async regeneratePassword() {
        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin/regenerate-password`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            email: this.admin.login,
          })
        })
        const responsed = await result.json()
        if(responsed.ok) {
          this.currentType = "success"
        } else {
          this.currentType = "failure"
        }
        setTimeout(() => {
          this.currentType = "empty"
        }, 2500)
      }
    },
    async beforeMount() {
      const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin/get/rights`)
      const responsed = await result.json()

      let arrayRights = Object.values(responsed)
      arrayRights = arrayRights.filter(right => right.indexOf('admin') > -1)
      this.allRights = arrayRights

      const data = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/super-user/admin/own-rights`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          admin_id: this.admin.admin_id
        })
      })
      const dataResult = await data.json()

      if(dataResult.ok) {
        dataResult.ownRights.forEach(right => {
          this.selectedRights.push(right.type)
        })
      }
    }
}
</script>