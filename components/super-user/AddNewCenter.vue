<template>
    <v-dialog
      v-model="isShowAdd"
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
          <v-toolbar-title>Новый центр</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="$emit('addNewCenter', center)"
            >
              Добавить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Информация</v-subheader>
          <v-list-item class="flex-column">
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Наименование учебного центра *"
              auto-grow
              row-height="7"
              row="1"
              v-model="center.title"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Пароль *"
              auto-grow
              row-height="7"
              row="1"
              v-model="center.password"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Контактное лицо"
              auto-grow
              row-height="7"
              row="1"
              v-model="center.contact_person"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Контактный телефон *"
              auto-grow
              row-height="7"
              row="1"
              v-model="center.phone"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Email *"
              auto-grow
              row-height="7"
              row="1"
              v-model="center.email"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Ссылка на сайт"
              auto-grow
              row-height="7"
              row="1"
              v-model="center.site_url"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Реквизиты"
              auto-grow
              row-height="15"
              row="1"
              v-model="center.requisites"
              ></v-textarea>
            </v-list-item-content>
            <v-list-item-content>
              <v-textarea
              name="input-7-1"
              filled
              label="Прочая информация"
              auto-grow
              row-height="20"
              row="1"
              v-model="center.add_notes"
              ></v-textarea>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "AddNewCenter",
    props: [ 'isShowAdd' ],
    data() {
        return {
            center: {
                title: "",
                password: "",
                contact_person: "",
                phone: "",
                email: "",
                site_url: "",
                requisites: "",
                add_notes: ""
            }
        }
    }
}
</script>

<style scoped>

</style>