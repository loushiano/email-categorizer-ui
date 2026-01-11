<template>
    <div class="p-6 w-96">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Add Category</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    id="name"
                    v-model="name"
                    type="text"
                    required
                    :class="INPUT_CLASS"
                    placeholder="Enter category name"
                />
            </div>
            <div class="mb-6">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
                    >Description</label
                >
                <textarea
                    id="description"
                    v-model="description"
                    rows="3"
                    :class="INPUT_CLASS"
                    placeholder="Enter category description (optional)"
                ></textarea>
            </div>
            <div class="flex justify-end gap-3">
                <button
                    type="button"
                    @click="dialogStore.closeDialog()"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <Spinner v-if="saving" />
                    <span>{{ saving ? 'Saving...' : 'Save' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { INPUT_CLASS } from '@/util/util'
import { useDialog } from '@/stores/dialog'
import { useAuthStore } from '@/stores/auth'
import { createEmailCategory } from './endpoints'
import Spinner from '../Spinner.vue'

const props = defineProps<{
    onSuccess: () => void
}>()

const dialogStore = useDialog()
const authStore = useAuthStore()

const name = ref('')
const description = ref('')
const saving = ref(false)

const handleSubmit = async () => {
    if (!name.value.trim()) return

    saving.value = true
    try {
        await createEmailCategory(
            {
                name: name.value.trim(),
                description: description.value.trim() || undefined
            },
            authStore
        )
        props.onSuccess()
        dialogStore.closeDialog()
    } catch (error) {
        console.error('Failed to create category:', error)
    } finally {
        saving.value = false
    }
}
</script>
