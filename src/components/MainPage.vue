<template>
    <div class="flex flex-col items-center">
        <button
            @click="connectClick"
            class="bg-indigo-700 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors mt-8 sm:block hidden"
        >
            <Spinner v-if="loading" />
            <span v-else>Login</span>
        </button>
    </div>
</template>
<script setup lang="ts">
import { apiGetPublic, apiPostPublic } from '@/util/api'
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { C } from 'vue-router/dist/router-CWoNjPRp.mjs'

const loading = ref(false)
const browser = ref<Window | null>(null)

const connectClick = async () => {
    const width = 700
    const height = 600
    loading.value = true
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2.5
    const title = `Google Login`
    const res = await apiGetPublic<string>('jumpapp/auth/google/url')
    const url = res
    const popup = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`)
    browser.value = popup as Window
}

onMounted(() => {})
</script>
