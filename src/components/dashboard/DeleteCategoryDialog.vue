<template>
    <div class="p-6 w-96">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Delete Category</h2>
        </div>

        <p class="text-sm text-gray-600 mb-2">
            Are you sure you want to delete <span class="font-medium">{{ categoryName }}</span>?
        </p>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p class="text-sm text-yellow-800">
                All emails in this category will be moved to <span class="font-medium">Uncategorized</span>.
            </p>
        </div>

        <div class="flex justify-end gap-3">
            <button
                type="button"
                @click="dialogStore.closeDialog()"
                :disabled="deleting"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="button"
                @click="handleDelete"
                :disabled="deleting"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
                <Spinner v-if="deleting" />
                <span>{{ deleting ? 'Deleting...' : 'Delete' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDialog } from '@/stores/dialog'
import { useAuthStore } from '@/stores/auth'
import { deleteEmailCategory } from './endpoints'
import Spinner from '../Spinner.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    categoryId: string
    categoryName: string
    onSuccess: () => void
}>()

const dialogStore = useDialog()
const authStore = useAuthStore()

const deleting = ref(false)

const handleDelete = async () => {
    deleting.value = true
    try {
        await deleteEmailCategory(props.categoryId, authStore)
        props.onSuccess()
        dialogStore.closeDialog()
    } catch (error) {
        console.error('Failed to delete category:', error)
    } finally {
        deleting.value = false
    }
}
</script>
