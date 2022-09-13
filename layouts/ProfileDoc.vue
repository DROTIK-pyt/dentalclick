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
  name: 'ProfileLayout',
  layout: 'ProfileDoc',
  components: {
    headerDoc,
  },
  beforeMount() {
    this.$store.commit('doctor/syncState')
  },
  beforeDestroy() {
    this.$store.commit('doctor/saveState')
  }
}
</script>

<style scoped>

</style>