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
    name: 'eduCursesLayout',
    layout: 'eduCurses',
    components: {
        headerEdu
    },
    data() {
        return {
            
        }
    }
}
</script>