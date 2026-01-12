<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header with Back Button -->
            <div class="flex items-center gap-4 mb-6">
                <button
                    @click="router.push('/dashboard')"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeftIcon class="w-5 h-5" />
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        {{ categoryName }}
                    </h1>
                    <p class="text-sm text-gray-500">
                        {{ emails.length }} email{{ emails.length !== 1 ? 's' : '' }}
                    </p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <Spinner color="indigo" />
            </div>

            <!-- Empty State -->
            <div v-else-if="emails.length === 0" class="text-center py-12">
                <InboxIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500">No emails in this category</p>
                <button
                    @click="router.push('/dashboard')"
                    class="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    Back to Dashboard
                </button>
            </div>

            <!-- Email List with Selection -->
            <div v-else>
                <!-- Selection Bar -->
                <div class="bg-white rounded-lg shadow p-3 mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            :checked="isAllSelected"
                            :indeterminate="isPartiallySelected"
                            @change="toggleSelectAll"
                            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <span class="text-sm text-gray-600">
                            <template v-if="selectedIds.size > 0">
                                {{ selectedIds.size }} selected
                            </template>
                            <template v-else> Select all </template>
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            @click="handleDeleteSelected"
                            :disabled="selectedIds.size === 0"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <TrashIcon class="w-4 h-4" />
                            Delete Selected
                        </button>
                        <button
                            @click="handleUnsubscribeSelected"
                            :disabled="selectedIds.size === 0"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <NoSymbolIcon class="w-4 h-4" />
                            Unsubscribe Selected
                        </button>
                    </div>
                </div>

                <!-- Email Cards -->
                <div class="space-y-4">
                    <div
                        v-for="email in emails"
                        :key="email.id"
                        :class="[
                            'bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow',
                            selectedIds.has(email.id) ? 'ring-2 ring-indigo-500' : ''
                        ]"
                    >
                        <div class="flex items-start gap-3">
                            <!-- Checkbox -->
                            <input
                                type="checkbox"
                                :checked="selectedIds.has(email.id)"
                                @change="toggleSelect(email.id)"
                                @click.stop
                                class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <!-- Email Content (clickable) -->
                            <div class="flex-1 min-w-0 cursor-pointer" @click="viewEmail(email)">
                                <!-- Email Header -->
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="font-medium text-gray-900 truncate">
                                                {{ email.from }}
                                            </span>
                                            <!-- Unsubscribe Status Badges -->
                                            <span
                                                v-if="email.unsubscribeStatus === 'completed'"
                                                class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                                            >
                                                Unsubscribed
                                            </span>
                                            <span
                                                v-else-if="email.unsubscribeStatus === 'processing'"
                                                class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"
                                            >
                                                <svg class="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Unsubscribing...
                                            </span>
                                            <span
                                                v-else-if="email.unsubscribeStatus === 'pending'"
                                                class="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full"
                                            >
                                                Unsubscribe Queued
                                            </span>
                                            <span
                                                v-else-if="email.unsubscribeStatus === 'failed'"
                                                class="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full"
                                            >
                                                Unsubscribe Failed
                                            </span>
                                            <span
                                                v-else-if="email.hasUnsubscribe"
                                                class="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full"
                                            >
                                                Subscribed
                                            </span>
                                            <!-- Processing Status Badges -->
                                            <span
                                                v-if="email.processingStatus === 'processing'"
                                                class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"
                                            >
                                                <svg class="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing...
                                            </span>
                                            <span
                                                v-else-if="email.processingStatus === 'pending'"
                                                class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                                            >
                                                Pending Analysis
                                            </span>
                                            <span
                                                v-else-if="email.processingStatus === 'failed' && email.processingAttempts < 2"
                                                class="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full"
                                            >
                                                Analysis Failed - Retrying
                                            </span>
                                            <span
                                                v-else-if="email.processingStatus === 'failed'"
                                                class="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full"
                                            >
                                                Analysis Failed
                                            </span>
                                        </div>
                                        <span class="text-xs text-gray-500 whitespace-nowrap mt-1">
                                            Inbox Email ID: {{ email.credential.inboxEmail }}
                                        </span>
                                        <h3
                                            class="text-lg font-semibold text-gray-900 mt-1 break-words"
                                        >
                                            {{ email.subject }}
                                        </h3>
                                    </div>
                                    <span class="text-xs text-gray-500 whitespace-nowrap ml-4">
                                        {{ formatDate(+email.creationDate) }}
                                    </span>
                                </div>

                                <!-- AI Summary -->
                                <div
                                    v-if="email.summary"
                                    class="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                                >
                                    <div class="flex items-center gap-2 mb-1">
                                        <SparklesIcon class="w-4 h-4 text-indigo-600" />
                                        <span class="text-xs font-medium text-indigo-600"
                                            >AI Summary</span
                                        >
                                    </div>
                                    <p class="text-sm text-gray-700 break-words whitespace-normal">
                                        {{ email.summary }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Email Detail Modal -->
        <TransitionRoot appear :show="showEmailDetail" as="template">
            <Dialog as="div" class="relative z-50" @close="showEmailDetail = false">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black/25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                                class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all"
                            >
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1 min-w-0 pr-4">
                                        <h3 class="text-lg font-semibold text-gray-900 break-words">
                                            {{ selectedEmail?.subject }}
                                        </h3>
                                        <p class="text-sm text-gray-500 mt-1">
                                            From: {{ selectedEmail?.from }}
                                        </p>
                                        <p class="text-xs text-gray-400">
                                            {{
                                                selectedEmail
                                                    ? formatDate(+selectedEmail.creationDate)
                                                    : ''
                                            }}
                                        </p>
                                    </div>
                                    <button
                                        @click="showEmailDetail = false"
                                        class="p-1 text-gray-400 hover:text-gray-600 rounded"
                                    >
                                        <XMarkIcon class="w-5 h-5" />
                                    </button>
                                </div>

                                <!-- AI Summary in Modal -->
                                <div
                                    v-if="selectedEmail?.summary"
                                    class="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                                >
                                    <div class="flex items-center gap-2 mb-1">
                                        <SparklesIcon class="w-4 h-4 text-indigo-600" />
                                        <span class="text-xs font-medium text-indigo-600"
                                            >AI Summary</span
                                        >
                                    </div>
                                    <p class="text-sm text-gray-700">
                                        {{ selectedEmail.summary }}
                                    </p>
                                </div>

                                <!-- Full Email Content -->
                                <div
                                    class="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50"
                                >
                                    <div
                                        v-if="selectedEmail?.htmlText"
                                        v-html="selectedEmail.htmlText"
                                        class="prose prose-sm max-w-none"
                                    ></div>
                                    <pre
                                        v-else
                                        class="whitespace-pre-wrap text-sm text-gray-700 font-sans"
                                        >{{ selectedEmail?.text }}</pre
                                    >
                                </div>

                                <div class="mt-4 flex justify-end">
                                    <button
                                        @click="showEmailDetail = false"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDialog } from '@/stores/dialog'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
    ArrowLeftIcon,
    InboxIcon,
    SparklesIcon,
    XMarkIcon,
    TrashIcon,
    NoSymbolIcon
} from '@heroicons/vue/24/outline'
import Spinner from '../Spinner.vue'
import DeleteEmailsDialog from './DeleteEmailsDialog.vue'
import UnsubscribeEmailsDialog from './UnsubscribeEmailsDialog.vue'
import {
    getEmailsByCategoryId,
    getUncategorizedEmails,
    getEmailCategory,
    type UserIncomingEmail,
    type UserEmailCategory
} from './endpoints'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const dialogStore = useDialog()

const loading = ref(true)
const emails = ref<UserIncomingEmail[]>([])
const category = ref<UserEmailCategory | null>(null)
const showEmailDetail = ref(false)
const selectedEmail = ref<UserIncomingEmail | null>(null)

// Selection state
const selectedIds = ref<Set<string>>(new Set())

const categoryId = computed(() => route.params.categoryId as string | undefined)
const isUncategorized = computed(() => route.name === 'UncategorizedEmails')

const categoryName = computed(() => {
    if (isUncategorized.value) {
        return 'Uncategorized'
    }
    return category.value?.name || 'Loading...'
})

// Selection computed
const isAllSelected = computed(() => {
    return emails.value.length > 0 && selectedIds.value.size === emails.value.length
})

const isPartiallySelected = computed(() => {
    return selectedIds.value.size > 0 && selectedIds.value.size < emails.value.length
})

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
        return 'Yesterday'
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'long' })
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
}

const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    // Strip HTML tags for preview
    const stripped = text
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    if (stripped.length <= maxLength) return stripped
    return stripped.substring(0, maxLength) + '...'
}

const viewEmail = (email: UserIncomingEmail) => {
    selectedEmail.value = email
    showEmailDetail.value = true
}

// Selection functions
const toggleSelect = (emailId: string) => {
    const newSet = new Set(selectedIds.value)
    if (newSet.has(emailId)) {
        newSet.delete(emailId)
    } else {
        newSet.add(emailId)
    }
    selectedIds.value = newSet
}

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedIds.value = new Set()
    } else {
        selectedIds.value = new Set(emails.value.map((e) => e.id))
    }
}

const handleDeleteSelected = () => {
    if (selectedIds.value.size === 0) return

    const idsToDelete = Array.from(selectedIds.value)
    dialogStore.openDialog(DeleteEmailsDialog, {
        ids: idsToDelete,
        count: idsToDelete.length,
        onSuccess: () => {
            // Remove deleted emails from the list
            emails.value = emails.value.filter((e) => !selectedIds.value.has(e.id))
            selectedIds.value = new Set()
        }
    })
}

const handleUnsubscribeSelected = () => {
    if (selectedIds.value.size === 0) return

    const idsToUnsubscribe = Array.from(selectedIds.value)
    dialogStore.openDialog(UnsubscribeEmailsDialog, {
        ids: idsToUnsubscribe,
        count: idsToUnsubscribe.length,
        onSuccess: async () => {
            // Refresh the list to show updated status
            await fetchData()
            selectedIds.value = new Set()
        }
    })
}

const fetchData = async (showLoading = true) => {
    if (showLoading) {
        loading.value = true
    }
    try {
        if (isUncategorized.value) {
            // Fetch uncategorized emails
            emails.value = await getUncategorizedEmails(authStore)
        } else if (categoryId.value) {
            // Fetch category details
            category.value = await getEmailCategory(categoryId.value, authStore)
            // Fetch emails by category
            emails.value = await getEmailsByCategoryId(categoryId.value, authStore)
        }
    } catch (error) {
        console.error('Failed to fetch emails:', error)
    } finally {
        loading.value = false
    }
}

// Polling for updates
let pollInterval: ReturnType<typeof setInterval> | null = null

const startPolling = () => {
    pollInterval = setInterval(() => {
        fetchData(false) // Don't show loading spinner on poll
    }, 5000)
}

const stopPolling = () => {
    if (pollInterval) {
        clearInterval(pollInterval)
        pollInterval = null
    }
}

onMounted(() => {
    fetchData()
    startPolling()
})

onUnmounted(() => {
    stopPolling()
})
</script>
