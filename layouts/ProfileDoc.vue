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
    this.$store.commit('doctors/syncState')
  },
  beforeDestroy() {
    this.$store.commit('doctors/saveState')
  }
}
</script>

<style scoped>

</style>