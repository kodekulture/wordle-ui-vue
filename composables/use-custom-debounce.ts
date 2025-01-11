export type DebounceStatus = 'debouncing' | 'idle' | 'executing'

export default function<T extends (...args: any[]) => Promise<any> | any>(fn: T, timeout: number) {
    /**
     * status is `idle` by default.
     *  `debouncing` while waiting
     *  `executing` while function is being executed.
     */
    const status = ref<DebounceStatus>('idle');
    /**
     * remaining: is the time left in milliseconds before function is executed.
     */
    const remaining = ref(0);
    /**
     * tracks error of function execution.
     */
    const error = ref<Error|null>(null);
    /**
     * data is the result of function call.
     */
    const data = ref<Awaited<ReturnType<T>> | null>(null);

    // timer
    let timerId: ReturnType<setTimeout> | null = null;
    let timerUpdateId: ReturnType<setInterval> | null = null;

    const stop = () => {
        if(timerId) clearTimeout(timerId)
        if (timerUpdateId) clearInterval(timerUpdateId)
    }

    const execute = (...args: Parameters<T>) => {
        stop()

        status.value = 'debouncing';
        remaining.value = timeout;
        error.value = null;
        data.value = null;

        // update the remaining time in real time
        const frequency = 100 // ms
        timerUpdateId = setInterval(() => {
            remaining.value -= frequency;
            if (remaining.value <= 0) {
                clearInterval(timerUpdateId)
                remaining.value = 0;
            }
        }, frequency)

        timerId = setTimeout(async () => {
            status.value = 'executing';
            clearInterval(timerUpdateId);
            try {
                const result = fn(...args);
               data.value = result instanceof Promise ? await result : result;
            } catch(e: Error) {
                error.value = e
            } finally {
                status.value = 'idle'
            }
        }, timeout)
    }

    return {
        status,
        remaining,
        error,
        data,
        execute,
        stop,
    }
}