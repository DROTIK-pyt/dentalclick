<template>
    <v-app>
        <v-main>
            <v-container>
                <headerEdu />
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import headerEdu from '~/components/headers/headerEdu.vue'

export default {
  name: 'ProfileLayout',
  layout: 'Profile',
  components: {
    headerEdu,
  },
  beforeMount() {
    this.$store.commit('eduCenter/syncState')
  },
  beforeDestroy() {
    this.$store.commit('eduCenter/saveState')
  }
}
</script>

<style scoped>

</style>