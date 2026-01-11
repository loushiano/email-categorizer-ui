<template>
    <div class="p-6 w-96">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Disconnect Inbox</h2>
        </div>

        <p class="text-sm text-gray-600 mb-2">
            Are you sure you want to disconnect <span class="font-medium">{{ inboxEmail }}</span>?
        </p>

        <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p class="text-sm text-red-800 font-medium mb-1">Warning: This action cannot be undone</p>
            <ul class="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Gmail watch will be stopped</li>
                <li>All emails from this inbox will be permanently deleted</li>
                <li>You will need to reconnect to receive new emails</li>
            </ul>
        </div>

        <div class="flex justify-end gap-3">
            <button
                type="button"
                @click="dialogStore.closeDialog()"
                :disabled="disconnecting"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="button"
                @click="handleDisconnect"
                :disabled="disconnecting"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
                <Spinner v-if="disconnecting" />
                <span>{{ disconnecting ? 'Disconnecting...' : 'Disconnect' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDialog } from '@/stores/dialog'
import { useAuthStore } from '@/stores/auth'
import { disconnectInbox } from './endpoints'
import Spinner from '../Spinner.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    credentialId: string
    inboxEmail: string
    onSuccess: () => void
}>()

const dialogStore = useDialog()
const authStore = useAuthStore()

const disconnecting = ref(false)

const handleDisconnect = async () => {
    disconnecting.value = true
    try {
        await disconnectInbox(props.credentialId, authStore)
        props.onSuccess()
        dialogStore.closeDialog()
    } catch (error) {
        console.error('Failed to disconnect inbox:', error)
    } finally {
        disconnecting.value = false
    }
}
</script>
