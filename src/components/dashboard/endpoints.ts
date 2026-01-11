import type { AuthStore } from '@/stores/auth'
import { apiGet, apiPost, apiDelete } from '@/util/api'

export interface UserCredential {
    id: string
    inboxEmail: string
    expiryDate: number
    watcherDate: number
}

export interface UserIncomingEmail {
    id: string
    from: string
    subject: string
    htmlText: string
    text: string
    summary: string
    creationDate: number
    attachments: string[]
    credential: UserCredential
    category: UserEmailCategory | null
    hasUnsubscribe: boolean
    isProcessed: boolean
    unsubscribed: boolean
}

export interface UserEmailCategory {
    id: string
    name: string
    description: string
}

// Credentials (Connected Inboxes)
export const getMyCredentials = (authStore: AuthStore) =>
    apiGet<UserCredential[]>('users/credentials', authStore)

// Incoming Emails
export const getMyIncomingEmails = (authStore: AuthStore) =>
    apiGet<UserIncomingEmail[]>('users/incoming-emails', authStore)

export const getIncomingEmail = (id: string, authStore: AuthStore) =>
    apiGet<UserIncomingEmail>(`users/incoming-emails/${id}`, authStore)

export const getEmailsByCategoryId = (categoryId: string, authStore: AuthStore) =>
    apiGet<UserIncomingEmail[]>(`users/incoming-emails/category/${categoryId}`, authStore)

export const getUncategorizedEmails = (authStore: AuthStore) =>
    apiGet<UserIncomingEmail[]>(`users/incoming-emails/uncategorized`, authStore)

export const getEmailCategory = (id: string, authStore: AuthStore) =>
    apiGet<UserEmailCategory>(`users/email-categories/${id}`, authStore)

// Bulk email operations
export const bulkDeleteEmails = (ids: string[], authStore: AuthStore) =>
    apiPost<{ deleted: number }>('users/incoming-emails/bulk-delete', { ids }, authStore)

export const bulkUnsubscribeEmails = (ids: string[], authStore: AuthStore) =>
    apiPost<{ processed: number }>('users/incoming-emails/bulk-unsubscribe', { ids }, authStore)

// Email Categories
export const getEmailCategories = (authStore: AuthStore) =>
    apiGet<UserEmailCategory[]>('users/email-categories', authStore)

export const createEmailCategory = (
    data: { name: string; description?: string },
    authStore: AuthStore
) => apiPost<UserEmailCategory>('users/email-categories', data, authStore)

export const deleteEmailCategory = (id: string, authStore: AuthStore) =>
    apiDelete<{ deleted: boolean }>(`users/email-categories/${id}`, authStore)

// Google Auth for adding new inbox
export const getAddInboxUrl = (authStore: AuthStore) =>
    apiGet<{ url: string }>('auth/google/url/add-inbox', authStore)

// Disconnect inbox (delete credential and all associated emails)
export const disconnectInbox = (credentialId: string, authStore: AuthStore) =>
    apiDelete<{ deleted: boolean; emailsDeleted: number; inboxEmail: string }>(
        `auth/google/credentials/${credentialId}`,
        authStore
    )
