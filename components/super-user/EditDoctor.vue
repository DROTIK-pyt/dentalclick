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
          <v-toolbar-title>Редактирование {{ doctor.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="saveDoctor"
              v-if="isAdmin && canEdit"
            >
              Сохранить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Данные доктора</v-subheader>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    label="Имя"
                    v-model="doctor.name"
                    :readonly="isAdmin && !canEdit"
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    label="Телефон"
                    v-model="doctor.phone"
                    :readonly="isAdmin && !canEdit"
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    label="E-mail"
                    v-model="doctor.email"
                    :readonly="isAdmin && !canEdit"
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    label="Пароль (оставьте пустым, если не нужно менять)"
                    v-model="newPassword"
                    :readonly="isAdmin && !canEdit"
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    label="Регион"
                    v-model="doctor.region"
                    :readonly="isAdmin && !canEdit"
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    label="Специализация"
                    v-model="doctor.specialization"
                    :readonly="isAdmin && !canEdit"
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Общее</v-subheader>
          <v-list-item>
            <v-list-item-content>
                <v-select
                    v-model="status"
                    :items="statuses"
                    label="Статус"
                    :readonly="isAdmin && !canEdit"
                ></v-select>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "EditDoctor",
    props: [ 'doctor', 'currentDoctorStatus', 'statuses', 'stat2id', 'isShow' ],
    data() {
        return {
            newPassword: "",
            status: "",

            isAdmin: false,
            canEdit: false,
        }
    },
    methods: {
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

                this.canEdit = rights.includes('admin_edit_curse')
            }
        },
        saveDoctor() {
            if(this.newPassword) {
                this.doctor.newPassword = this.newPassword
            }


            this.$emit('saveDoctor', {
                aDoctor: this.doctor,
                aStatus: this.stat2id[this.status],
            })
        }
    },
    beforeMount() {
        this.status = this.currentDoctorStatus
    }
}
</script>

<style scoped>

</style>