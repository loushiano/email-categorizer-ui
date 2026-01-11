import { createRouter, createWebHistory } from 'vue-router'

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Create a reactive loading state that can be imported in other components
export const isRouteChanging = ref(false)

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            name: 'Main',
            component: () => import('../components/MainPage.vue')
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('../components/dashboard/DashboardPage.vue')
        },
        {
            path: '/dashboard/emails/category/:categoryId',
            name: 'EmailsByCategory',
            component: () => import('../components/dashboard/EmailsByCategoryPage.vue')
        },
        {
            path: '/dashboard/emails/uncategorized',
            name: 'UncategorizedEmails',
            component: () => import('../components/dashboard/EmailsByCategoryPage.vue')
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
