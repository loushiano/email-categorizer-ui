import { DateTime } from 'luxon'

export const capitalizeFirstLetter = (str: string) => {
    return `${str.charAt(0).toUpperCase()}${str.substring(1)}`
}
export const INPUT_CLASS = `block w-full rounded-md border-0  pl-1.5 py-1.5  text-black shadow-sm ring-1 ring-inset  ring-black/30  focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`

export const exists = (value: string) => {
    if (!value) {
        return false
    }
    return true
}
export const isEmail = (value: string) => {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
}
export const isPhoneWithCountryCode = (value: string) => {
    return (
        /^\+\d{1,3}\s?\d{1,14}(\s?\d{1,13})?$/.test(value) ||
        /^\(\d{3}\) \d{3}-\d{4}$/.test(value) ||
        /^[0-9]{10}$/.test(value)
    )
}

export const isPhone = (value: string) => {
    return (
        /^\+\d{1,3}\s?\d{1,14}(\s?\d{1,13})?$/.test(value) ||
        /^\(\d{3}\) \d{3}-\d{4}$/.test(value) ||
        /^[0-9]{10}$/.test(value)
    )
}

export const getVal = (num: number, unit: string, total: number) => {
    const val = unit == 'dollar' ? +num : +((total * +num) / 100).toFixed(2)
    return val
}
export const isValidPassword = (value: string) => {
    return (
        !!value &&
        value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/)
    )
}

export const openFile = (url: string) => {
    window.open(`${url}`, '_blank')?.focus()
}
export function parseJwt(token: string) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join('')
    )
    return JSON.parse(jsonPayload)
}

export const timeSince = (createdAt: number): string => {
    return DateTime.fromMillis(+createdAt).toRelative() || ''
}
export const formatDate = (date: number): string => {
    return DateTime.fromMillis(+date).toFormat('dd MMM yyyy HH:mm')
}
export const formatDateToDay = (date: number): string => {
    return DateTime.fromMillis(+date).toFormat('dd MMM yyyy')
}
export const formatDateToInput = (date: number): string => {
    return DateTime.fromMillis(+date).toFormat('yyyy-MM-dd')
}


export function snakeToCamelCase(str: string): string {
    return str
        .split('_')
        .map((word, index) => {
            if (index === 0) {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
}
