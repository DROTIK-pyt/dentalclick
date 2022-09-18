<template>
    <v-app>
        <v-main>
            <v-container>
                <headerSuperUser />
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import headerSuperUser from '~/components/headers/headerSuperUser'

export default {
  name: 'ProfileSuperUser',
  layout: 'ProfileSuperUser',
  components: {
    headerSuperUser,
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