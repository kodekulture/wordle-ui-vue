import { useToast } from "#build/imports";

export const WORD_LENGTH: number = 5;
export const MAX_GUESSES: number = 6;

export function showToastError(text: string) {
    const toast = useToast()
    toast.add({
        title: text,
        color: 'red',
        icon: 'i-heroicons-solid-exclamation-triangle',
    })
}

export function trimScheme(str: string): string {
    const schemes = ['https://', 'http://']
    return str.replace(/https?:\/\//gi, '').trim()
}