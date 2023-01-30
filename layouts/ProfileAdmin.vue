<template>
    <v-app>
        <v-main>
            <v-container>
                <headerAdmin />
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import headerAdmin from '~/components/headers/headerAdmin.vue';

export default {
  name: 'ProfileSuperUser',
  layout: 'ProfileSuperUser',
  components: {
    headerAdmin,
  },
  beforeMount() {
    this.$store.commit('admins/syncState')
  },
  beforeDestroy() {
    this.$store.commit('admins/saveState')
  }
}
</script>

<style scoped>

</style>