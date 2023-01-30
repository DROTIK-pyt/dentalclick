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
              v-if="isAdmin && canRemove"
            >
              Удалить центр
            </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="$emit('stopCenter', center.educational_center_id)"
              v-if="isAdmin && canEdit"
            >
              {{ text }}
            </v-btn>
            <v-btn
              dark
              text
              @click="save"
              v-if="isAdmin && canEdit"
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
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Пароль (оставьте пустым, если менять не нужно)"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.password"
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Контактное лицо"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.contact_person"
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Контактный телефон"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.phone"
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-select
                  v-model="currentRights"
                  :items="rights"
                  item-text="type"
                  item-value="access_rights_id"
                  label="Права"
                  chips
                  multiple
                  
                  :readonly="isAdmin && !canEdit"
                ></v-select>
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
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Ссылка на сайт"
                auto-grow
                row-height="7"
                row="1"
                v-model="center.site_url"
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Реквизиты"
                auto-grow
                row-height="15"
                row="1"
                v-model="center.requisites"
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
                <v-textarea
                name="input-7-1"
                filled
                label="Прочая информация"
                auto-grow
                row-height="20"
                row="1"
                v-model="center.add_notes"
                
                :readonly="isAdmin && !canEdit"
                ></v-textarea>
              </v-col>
          </v-row>
      </v-container>  
      </v-card>
    </v-dialog>
</template>

<script>
const baseSettings = require('../../server/config/serverSetting')
export default {
  name: 'ViewCenter',
  props: [ 'title', 'isShow', 'center', 'status', 'rights', 'rightsEdu' ],
  data() {
    return{
      currentRights: [],

      canEdit: false,
      canRemove: false,

      isAdmin: false
    }
  },
  methods: {
    save() {

      this.$emit('save', this.currentRights)
    },
    async checkAccesses() {
      if(this.$store.getters['admins/getId']) {
        this.isAdmin = true
        const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/admin/accesses`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
              admin_id: this.$store.getters['admins/getId']
          })
        })
        const {accessRights} = await result.json()

        let rights = []
        for(const accessRight of accessRights) {
          rights.push(accessRight.type)
        }

        this.canEdit = rights.includes('admin_edit_center')
        this.canRemove = rights.includes('admin_remove_center')
        // this.canAdd = rights.includes('admin_add_center')
      }
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
  },
  async beforeMount() {
    this.currentRights = this.rightsEdu

    this.checkAccesses()
  }
}
</script>

<style scoped>

</style>