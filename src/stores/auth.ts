// stores/auth.ts
import { parseJwt } from '@/util/util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AuthState {
    isLoggedIn: boolean
    token: string | null
    expiryDate: number
}

export interface AuthStore {
    logout: Function
    setLoginState: Function
    renewToken: Function
    state: AuthState
}

export const useAuthStore = defineStore('auth', () => {
    const initialAuth = JSON.parse(localStorage.getItem('auth') || '{}')
    const state = ref<AuthState>({
        isLoggedIn: initialAuth.isLoggedIn || false,
        token: initialAuth.token || null,
        expiryDate: initialAuth.expiryDate || 0
    })
    function setLoginState(token: string) {
        const expiryDate = parseJwt(token).exp
        state.value.token = token
        state.value.isLoggedIn = true
        state.value.expiryDate = expiryDate

        localStorage.setItem(
            'auth',
            JSON.stringify({
                token,
                isLoggedIn: true,
                expiryDate
            })
        )
    }
    function renewToken(token: string) {
        const expiryDate = parseJwt(token).exp
        state.value = { ...state.value, token, expiryDate }
        localStorage.setItem(
            'auth',
            JSON.stringify({
                token,
                isLoggedIn: true,
                expiryDate
            })
        )
    }
    function logout() {
        state.value.token = null
        state.value.isLoggedIn = false
        state.value.expiryDate = 0
        localStorage.removeItem('auth')
    }

    return {
        state,
        setLoginState,
        logout,
        renewToken
    }
})
