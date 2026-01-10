import { createRouter, createWebHistory } from 'vue-router'

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Create a reactive loading state that can be imported in other components
export const isRouteChanging = ref(false)

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // the children array here, can be extracted and used in all other integrations.
        {
            path: '',
            name: 'Main',
            component: () => import('../components/MainPage.vue')
        }
    ]
})
router.beforeEach(async (to, from) => {
    isRouteChanging.value = true
    const authStore = useAuthStore()
    if (!authStore.state.isLoggedIn && !['Main'].includes(to.name as string)) {
        // redirect the user to the login page with the intended destination
        return {
            name: 'Main',
            query: { redirect: to.fullPath }
        }
    }
})
export default router
