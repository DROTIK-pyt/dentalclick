<template>
    <v-app>
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
  name: 'dafault',
  layout: "dafaultLayout",
  components: {
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