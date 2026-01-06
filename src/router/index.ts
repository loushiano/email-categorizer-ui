import { createRouter, createWebHistory } from 'vue-router'

import { ref } from 'vue'

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
        },
     
    ]
})



export default router
