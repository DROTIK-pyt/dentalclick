<template>
    <v-app>
        <v-main>
            <v-container>
                <headerDoc />
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import headerDoc from '~/components/headers/headerDoc.vue'

export default {
  name: 'docProfileLayout',
  layout: 'docProfile',
  components: {
    headerDoc,
  }
}
</script>

<style scoped>

</style>