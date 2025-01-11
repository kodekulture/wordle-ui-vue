export const WORD_LENGTH: number = 5;
export const MAX_GUESSES: number = 6;
export const DEBOUNCE_TIMER = 1000;

export function showToastError(text: string) {
    const toast = useToast()
    toast.add({
        title: text,
        color: 'red',
        icon: 'i-heroicons-solid-exclamation-triangle',
    })
}

export function pluralize(text: string, count: number = 0): string {
    if (count === 1) {
        return text
    }
    if (text.endsWith('s')) {
        return `${text}es`
    }
    return `${text}s`
}

export function convertToWebSocketURL(url: string): string {
    return url.replace(/^(http)(s)?:\/\//i, (_, http, https) => https ? 'wss://' : 'ws://');
}

/**
 * emit is a ref<T> that set's value and resets to null after timeout
 * @param initial value
 * @param opts options
 */
export function emit<T>(initial: T | null, opts?: EmitOpts) {
    const _data = ref<T | null>(initial);
    const tm = {
        ...defaultOpts,
        ...opts,
    }
    return computed({
        set: (val: T | null) => {
            _data.value = val;
            setTimeout(() => {
                _data.value = null
            }, tm.resetAfter)
        },
        get: (): T | null => _data.value
    })

}

const defaultOpts: EmitOpts = {
    resetAfter: 200,
}

export interface EmitOpts {
    resetAfter: number;
}