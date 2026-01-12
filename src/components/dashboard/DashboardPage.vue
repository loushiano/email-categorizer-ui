<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button
                    @click="logout"
                    class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    <ArrowRightOnRectangleIcon class="w-4 h-4" />
                    Logout
                </button>
            </div>

            <!-- Email Limit Warning -->
            <div
                v-if="emailStatus?.isLimitReached"
                class="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
            >
                <div class="flex items-start gap-3">
                    <ExclamationTriangleIcon class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 class="text-sm font-medium text-amber-800">Email Limit Reached</h3>
                        <p class="text-sm text-amber-700 mt-1">
                            You have reached your limit of {{ emailStatus.emailLimit }} emails.
                            New emails will no longer be synced from your connected inboxes.
                            Please delete some emails to continue receiving new ones.
                        </p>
                        <p class="text-xs text-amber-600 mt-2">
                            Current usage: {{ emailStatus.emailCount }} / {{ emailStatus.emailLimit }} emails
                        </p>
                    </div>
                </div>
            </div>

            <!-- Email Usage Progress (when not at limit) -->
            <div
                v-else-if="emailStatus && emailStatus.emailCount > 0"
                class="mb-6 bg-white border border-gray-200 rounded-lg p-4"
            >
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Email Usage</span>
                    <span class="text-sm font-medium text-gray-900">
                        {{ emailStatus.emailCount }} / {{ emailStatus.emailLimit }}
                    </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                        class="h-2 rounded-full transition-all"
                        :class="[
                            emailStatus.emailCount / emailStatus.emailLimit > 0.8
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                        ]"
                        :style="{ width: `${(emailStatus.emailCount / emailStatus.emailLimit) * 100}%` }"
                    ></div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="-mb-px flex space-x-8">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        :class="[
                            activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        ]"
                    >
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div v-if="loading" class="flex justify-center py-12">
                <Spinner color="indigo" />
            </div>
            <!-- Categories Tab -->
            <div v-else-if="activeTab === 'categories'">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Email Categories</h3>
                    <button
                        @click="openAddCategoryDialog()"
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        <PlusIcon class="w-4 h-4" />
                        Add Category
                    </button>
                </div>

                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Uncategorized Cards per Credential -->
                    <router-link
                        :to="{
                            name: 'UncategorizedEmails'
                        }"
                        class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-200 hover:border-gray-300"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <InboxIcon class="w-5 h-5 text-gray-400" />
                                    <h4 class="font-medium text-gray-700">Uncategorized</h4>
                                </div>
                            </div>
                            <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                        </div>
                    </router-link>

                    <!-- User Categories -->
                    <div
                        v-for="cat in categories"
                        :key="cat.id"
                        class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-start justify-between">
                            <router-link
                                :to="{
                                    name: 'EmailsByCategory',
                                    params: { categoryId: cat.id }
                                }"
                                class="flex-1 cursor-pointer"
                            >
                                <div class="flex items-center gap-2">
                                    <TagIcon class="w-5 h-5 text-indigo-500" />
                                    <h4 class="font-medium text-gray-900">
                                        {{ cat.name }}
                                    </h4>
                                </div>
                                <p class="text-sm text-gray-500 mt-1">
                                    {{ cat.description || 'No description' }}
                                </p>
                            </router-link>
                            <div class="flex items-center gap-1 ml-2">
                                <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                                <button
                                    @click.prevent="handleDeleteCategory(cat.id, cat.name)"
                                    class="p-1 text-gray-400 hover:text-red-600 rounded"
                                    title="Delete"
                                >
                                    <TrashIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Connected Inboxes Tab -->
            <div v-else-if="activeTab === 'inboxes'">
                <div class="mb-4">
                    <button
                        @click="addNewInbox"
                        :disabled="addingInbox"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Spinner v-if="addingInbox" color="gray" />
                        <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
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
                        <span>Connect Google Inbox</span>
                    </button>
                </div>

                <div v-if="credentials.length === 0" class="text-center py-12 text-gray-500">
                    No connected inboxes. Click the button above to connect your Google inbox.
                </div>
                <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="cred in credentials"
                        :key="cred.id"
                        class="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                    >
                        <div
                            class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"
                        >
                            <EnvelopeIcon class="w-5 h-5 text-indigo-600" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                                {{ cred.inboxEmail }}
                            </p>
                            <p class="text-xs text-gray-500">
                                Connected {{ timeSince(cred.watcherDate) }}
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <div
                                class="w-2 h-2 rounded-full"
                                :class="isActive(cred) ? 'bg-green-500' : 'bg-red-500'"
                                :title="isActive(cred) ? 'Active' : 'Expired'"
                            ></div>
                            <button
                                @click="handleDisconnectInbox(cred)"
                                class="p-1 text-gray-400 hover:text-red-600 rounded"
                                title="Disconnect inbox"
                            >
                                <XCircleIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDialog } from '@/stores/dialog'
import { timeSince } from '@/util/util'
import {
    getMyCredentials,
    getEmailCategories,
    getAddInboxUrl,
    getUserEmailStatus,
    type UserCredential,
    type UserEmailCategory,
    type UserEmailStatus
} from './endpoints'
import AddCategoryDialog from './AddCategoryDialog.vue'
import DeleteCategoryDialog from './DeleteCategoryDialog.vue'
import DisableInboxDialog from './DisableInboxDialog.vue'
import Spinner from '../Spinner.vue'
import {
    EnvelopeIcon,
    PlusIcon,
    TrashIcon,
    ChevronRightIcon,
    TagIcon,
    InboxIcon,
    ArrowRightOnRectangleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const dialogStore = useDialog()

const tabs = [
    { id: 'categories', name: 'Categories' },
    { id: 'inboxes', name: 'Connected Inboxes' }
]

const activeTab = ref('categories')
const loading = ref(true)
const addingInbox = ref(false)

const credentials = ref<UserCredential[]>([])
const categories = ref<UserEmailCategory[]>([])
const emailStatus = ref<UserEmailStatus | null>(null)

const fetchData = async () => {
    loading.value = true
    try {
        const [creds, cats, status] = await Promise.all([
            getMyCredentials(authStore),
            getEmailCategories(authStore),
            getUserEmailStatus(authStore)
        ])
        credentials.value = creds
        categories.value = cats
        emailStatus.value = status
    } catch (error) {
        console.error('Failed to fetch data:', error)
    } finally {
        loading.value = false
    }
}

const isActive = (cred: UserCredential) => {
    return cred.expiryDate > Date.now()
}

const logout = () => {
    authStore.logout()
    router.push('/')
}

const addNewInbox = async () => {
    addingInbox.value = true
    try {
        const res = await getAddInboxUrl(authStore)
        const width = 700
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2.5
        window.open(
            res.url,
            'Add Google Inbox',
            `width=${width},height=${height},left=${left},top=${top}`
        )
    } catch (error) {
        console.error('Failed to get add inbox URL:', error)
    } finally {
        addingInbox.value = false
    }
}

const handleAddInboxMessage = (event: MessageEvent) => {
    if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        fetchData()
    }
}

const openAddCategoryDialog = () => {
    dialogStore.openDialog(AddCategoryDialog, {
        onSuccess: () => refreshCategories()
    })
}

const refreshCategories = async () => {
    try {
        categories.value = await getEmailCategories(authStore)
    } catch (error) {
        console.error('Failed to refresh categories:', error)
    }
}

const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    dialogStore.openDialog(DeleteCategoryDialog, {
        categoryId,
        categoryName,
        onSuccess: () => refreshCategories()
    })
}

const handleDisconnectInbox = (cred: UserCredential) => {
    dialogStore.openDialog(DisableInboxDialog, {
        credentialId: cred.id,
        inboxEmail: cred.inboxEmail,
        onSuccess: () => refreshCredentials()
    })
}

const refreshCredentials = async () => {
    try {
        credentials.value = await getMyCredentials(authStore)
    } catch (error) {
        console.error('Failed to refresh credentials:', error)
    }
}

onMounted(() => {
    fetchData()
    window.addEventListener('message', handleAddInboxMessage)
})

onUnmounted(() => {
    window.removeEventListener('message', handleAddInboxMessage)
})
</script>
