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
          <v-toolbar-title v-if="moderData.type === 'doctor'">Модерация доктора</v-toolbar-title>
          <v-toolbar-title v-else-if="moderData.type === 'eduCenter'">Модерация оброзовательного центра</v-toolbar-title>
          <v-toolbar-title v-else>Модерация</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="acceptNewData"
            >
              Принять
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list
          three-line
          subheader
          v-if="moderData.type === 'doctor'"
        >
          <v-subheader>Информация</v-subheader>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    :value="moderData.newInfo.name"
                    label="Имя"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.email"
                    label="E-mail"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.phone"
                    label="Телефон"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.region"
                    label="Регион"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.specialization"
                    label="Специализация"
                    solo
                    readonly
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list
          three-line
          subheader
          v-if="moderData.type === 'eduCenter'"
        >
          <v-subheader>Информация</v-subheader>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    :value="moderData.newInfo.title"
                    label="Наименование центра"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.email"
                    label="E-mail"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.phone"
                    label="Телефон"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.contact_person"
                    label="Контактное лицо"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.site_url"
                    label="Ссылка на сайт"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.requisites"
                    label="Реквизиты"
                    solo
                    readonly
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-text-field
                    :value="moderData.newInfo.add_notes"
                    label="Доп. информация"
                    solo
                    readonly
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list
          three-line
          subheader
          v-if="moderData.type === 'doctor-change-accesses'"
        >
            <v-subheader>{{ moderData.newInfo.text }} #{{ moderData.id }} доктора</v-subheader>
            <v-list-item>
                <v-list-item-content>
                    <v-text-field
                        :value="moderData.newInfo.name"
                        label="Доступы"
                        solo
                        readonly
                    ></v-text-field>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list
          three-line
          subheader
          v-if="moderData.type === 'edu-center-change-accesses'"
        >
          <v-subheader>{{ moderData.newInfo.text }} #{{ moderData.id }} оброзовательного центра</v-subheader>
          <v-list-item>
            <v-list-item-content>
                <v-text-field
                    :value="moderData.newInfo.name"
                    label="Доступы"
                    solo
                    readonly
                ></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ViewModeration",
    props: [ 'isShow', 'moderData' ],
    data() {
        return {
            
        }
    },
    methods: {
      acceptNewData() {
        this.$emit('accept')
      }
    },
}
</script>