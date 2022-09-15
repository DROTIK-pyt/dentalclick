<template>
    <v-row>
        <v-col
        cols="12"
        sm="6"
        class="mt-6"
        >
        <h2>Регистрация нового доктора</h2>
        <p>Спасибо за проявленный интерес к нашей площадке!</p>
        <p>Пожалуйста заполните информацию о себе.</p>
        <v-textarea
          label="Ваше ФИО"
          auto-grow
          rows="1"
          v-model="name"
          row-height="15"
        ></v-textarea>
        <v-textarea
          label="Ваш телефон"
          auto-grow
          rows="1"
          v-model="phone"
          row-height="15"
        ></v-textarea>
        <v-textarea
          label="Ваш E-mail"
          auto-grow
          rows="1"
          v-model="email"
          row-height="15"
        ></v-textarea>
        <v-textarea
          label="Ваш регион"
          auto-grow
          rows="1"
          v-model="region"
          row-height="15"
        ></v-textarea>
        <v-textarea
          label="Ваша(и) специализация(и)"
          auto-grow
          rows="2"
          v-model="specialization"
          row-height="20"
        ></v-textarea>
        <v-textarea
          label="Придумайте пароль"
          auto-grow
          rows="1"
          v-model="password"
          row-height="15"
        ></v-textarea>
        <v-btn
        depressed
        @click="sendToRegistrate"
        color="primary"
        >
            Отправить
        </v-btn>
        <CompleteSended
            :isSended="isSended"
            @close="isSended = false"
        />
        <ErrorSended
            :isError="isError"
            @close="isError = false"
        />
        </v-col>
    </v-row>
</template>

<script>
import CompleteSended from '~/components/doctors/CompleteSended'
import ErrorSended from '~/components/doctors/ErrorSended'

const baseSettings = require('../../server/config/serverSetting')
const base64 = require('base-64')

export default {
    data() {
        return {
            isSended: false,
            isError: false,
            name: "",
            phone: "",
            email: "",
            specialization: "",
            region: "",
            password: "",
        }
    },
    components: { CompleteSended, ErrorSended },
    methods: {
        async sendToRegistrate() {
            const result = await fetch(`${baseSettings.baseUrl}:${baseSettings.port}/doctor/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + this.$store.getters['doctors/getTokens'].access
                },
                body: JSON.stringify({
                    name: this.name,
                    phone: this.phone,
                    email: this.email,
                    region: this.region,
                    specialization: this.specialization,
                    password: this.password,
                })
            })
            
            const responsed = await result.json()
            if(responsed.ok) {
                this.isSended = true
            } else {
                this.isError = true
            }
        },
    },
}
</script>

<style scoped>

</style>