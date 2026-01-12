<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <header class="pt-6">
                <div class="flex items-center gap-2">
                    <EnvelopeIcon class="w-8 h-8 text-indigo-600" />
                    <span class="text-xl font-bold text-gray-900">EmailAI</span>
                </div>
            </header>

            <!-- Hero Section -->
            <main class="pt-16 pb-20 lg:pt-24">
                <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <!-- Left Column - Text Content -->
                    <div class="text-center lg:text-left">
                        <h1
                            class="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight"
                        >
                            Your AI-Powered
                            <span class="text-indigo-600">Email Assistant</span>
                        </h1>
                        <p class="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                            Let AI organize your inbox. EmailAI automatically categorizes,
                            summarizes, and highlights important emails so you can focus on what
                            matters most.
                        </p>

                        <!-- Features List -->
                        <div class="mt-10 space-y-4">
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                                >
                                    <SparklesIcon class="w-5 h-5 text-indigo-600" />
                                </div>
                                <div class="text-left">
                                    <h3 class="font-semibold text-gray-900">
                                        Smart Categorization
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        AI automatically sorts emails into your custom categories
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                                >
                                    <DocumentTextIcon class="w-5 h-5 text-purple-600" />
                                </div>
                                <div class="text-left">
                                    <h3 class="font-semibold text-gray-900">Instant Summaries</h3>
                                    <p class="text-sm text-gray-500">
                                        Get concise summaries of every email at a glance
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                                >
                                    <BellSlashIcon class="w-5 h-5 text-green-600" />
                                </div>
                                <div class="text-left">
                                    <h3 class="font-semibold text-gray-900">
                                        Unsubscribe Detection
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        Easily identify promotional emails you can unsubscribe from
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Button -->
                        <div class="mt-10">
                            <button
                                @click="connectClick"
                                :disabled="loading"
                                class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Spinner v-if="loading" color="gray" />
                                <template v-else>
                                    <!-- Google Icon -->
                                    <svg class="w-6 h-6" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span class="text-gray-700 font-medium"
                                        >Continue with Google</span
                                    >
                                </template>
                            </button>
                        </div>
                    </div>

                    <!-- Right Column - Illustration/Preview -->
                    <div class="hidden lg:block">
                        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <!-- Mock Email Preview -->
                            <div class="space-y-4">
                                <div class="flex items-center gap-3 pb-4 border-b">
                                    <div
                                        class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
                                    >
                                        <InboxIcon class="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">
                                            Your Smart Inbox
                                        </h3>
                                        <p class="text-sm text-gray-500">3 new emails processed</p>
                                    </div>
                                </div>

                                <!-- Mock Email Items -->
                                <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2">
                                                <span class="font-medium text-gray-900"
                                                    >Project Update</span
                                                >
                                                <span
                                                    class="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                                                    >Work</span
                                                >
                                            </div>
                                            <p class="text-sm text-gray-500 mt-1">
                                                Team meeting scheduled for tomorrow to discuss Q4
                                                goals...
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2">
                                                <span class="font-medium text-gray-900"
                                                    >Flight Confirmation</span
                                                >
                                                <span
                                                    class="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full"
                                                    >Travel</span
                                                >
                                            </div>
                                            <p class="text-sm text-gray-500 mt-1">
                                                Your flight to NYC is confirmed for Dec 15th...
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2">
                                                <span class="font-medium text-gray-900"
                                                    >Weekly Newsletter</span
                                                >
                                                <span
                                                    class="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full"
                                                    >Unsub</span
                                                >
                                            </div>
                                            <p class="text-sm text-gray-500 mt-1">
                                                This week's top stories and updates from the
                                                industry...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiGetPublic } from '@/util/api'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/stores/notification'
import Spinner from './Spinner.vue'
import {
    EnvelopeIcon,
    SparklesIcon,
    DocumentTextIcon,
    BellSlashIcon,
    InboxIcon
} from '@heroicons/vue/24/outline'

const loading = ref(false)
const popup = ref<Window | null>(null)
const popupCheckInterval = ref<number | null>(null)
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.token) {
        authStore.setLoginState(`Bearer ${event.data.token}`)
        loading.value = false
        cleanupPopup()
        router.push('/dashboard')
    }
}

const cleanupPopup = () => {
    if (popupCheckInterval.value) {
        clearInterval(popupCheckInterval.value)
        popupCheckInterval.value = null
    }
    popup.value = null
}

const watchPopupClosed = () => {
    // Check every 500ms if popup was closed
    popupCheckInterval.value = window.setInterval(() => {
        if (popup.value && popup.value.closed) {
            loading.value = false
            cleanupPopup()
        }
    }, 500)
}

const connectClick = async () => {
    const width = 700
    const height = 600
    loading.value = true

    try {
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const title = `Google Login`
        const res = await apiGetPublic<{ url: string }>('auth/google/url')
        const url = res.url
        const openedPopup = window.open(
            url,
            title,
            `width=${width},height=${height},left=${left},top=${top}`
        )

        if (!openedPopup) {
            throw new Error('Popup was blocked. Please allow popups for this site.')
        }

        popup.value = openedPopup
        watchPopupClosed()
    } catch (error) {
        loading.value = false
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Failed to connect with Google. Please try again.'
        toast.showToast('Connection Failed', errorMessage, 'error')
    }
}

onMounted(() => {
    // Redirect to dashboard if already logged in
    if (authStore.state.isLoggedIn) {
        router.push('/dashboard')
        return
    }
    window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
    cleanupPopup()
})
</script>
