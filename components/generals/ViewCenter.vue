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
          <v-toolbar-title>Основная информация - {{ title }}</v-toolbar-title>
          <v-btn
              dark
              text
              @click="$emit('deleteCenter', center.educational_center_id)"
            >
              Удалить центр
            </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="$emit('stopCenter', center.educational_center_id)"
            >
              {{ text }}
            </v-btn>
            <v-btn
              dark
              text
              @click="$emit('save')"
            >
              Сохранить изменения
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row class="pt-5">
              <v-col
              cols="12"
              sm="6"
              >
                <v-textarea
                name="input-7-1"
                filled
                label="Наименование учебного центра"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.title"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Пароль (оставьте пустым, если менять не нужно)"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.password"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Контактное лицо"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.contact_person"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Контактный телефон"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.phone"
                ></v-textarea>
              </v-col>
              <v-col
              cols="12"
              sm="6"
              >
                <v-textarea
                name="input-7-1"
                filled
                label="Email"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.email"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Ссылка на сайт"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.site_url"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Реквизиты"
                auto-grow
                row-height="15"
                row="1"
                v-model="center.requisites"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Прочая информация"
                auto-grow
                row-height="20"
                row="1"
                v-model="center.add_notes"
                ></v-textarea>
              </v-col>
          </v-row>
      </v-container>  
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'ViewCenter',
  props: [ 'title', 'isShow', 'center', 'status' ],
  data() {
    return{
    }
  },
  computed: {
    text() {
      if(this.status === 'blocked') {
        return "Возобновить"
      } else {
        return "Приостановить"
      }
    },
  }
}
</script>

<style scoped>

</style>