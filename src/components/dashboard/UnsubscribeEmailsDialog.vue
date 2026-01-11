<template>
    <div class="p-6 w-96">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <NoSymbolIcon class="w-5 h-5 text-yellow-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Unsubscribe</h2>
        </div>

        <p class="text-sm text-gray-600 mb-4">
            Are you sure you want to unsubscribe from
            <span class="font-medium">{{ count }} sender{{ count > 1 ? 's' : '' }}</span>?
        </p>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p class="text-sm text-yellow-800">
                This will attempt to unsubscribe you from future emails from these senders.
            </p>
        </div>

        <div class="flex justify-end gap-3">
            <button
                type="button"
                @click="dialogStore.closeDialog()"
                :disabled="processing"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="button"
                @click="handleUnsubscribe"
                :disabled="processing"
                class="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
            >
                <Spinner v-if="processing" />
                <span>{{ processing ? 'Processing...' : 'Unsubscribe' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDialog } from '@/stores/dialog'
import { useAuthStore } from '@/stores/auth'
import { bulkUnsubscribeEmails } from './endpoints'
import Spinner from '../Spinner.vue'
import { NoSymbolIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    ids: string[]
    count: number
    onSuccess: () => void
}>()

const dialogStore = useDialog()
const authStore = useAuthStore()

const processing = ref(false)

const handleUnsubscribe = async () => {
    processing.value = true
    try {
        await bulkUnsubscribeEmails(props.ids, authStore)
        props.onSuccess()
        dialogStore.closeDialog()
    } catch (error) {
        console.error('Failed to unsubscribe:', error)
    } finally {
        processing.value = false
    }
}
</script>
