import type {WatchSource} from "vue";

// every event on watchable increments
export default function(watchable: WatchSource, present?: () => boolean)
export default function(watchable: WatchSource, present?: WatchSource<boolean>)
export default function(watchable: WatchSource, present?: () => boolean | WatchSource<boolean>){
    const missed = ref(0)

    if (present != null && isRef<boolean>(present)) {
        watch(present, () => {
            if (present.value) {
                missed.value = 0
            }
        })
    }

    const presentRef = computed(() => {
        const presentValue = typeof present === 'function' ? present() : present
        if (isRef<boolean>(presentValue)) {
            return presentValue.value
        } else if (typeof presentValue === 'boolean') {
            return presentValue
        }
        return false
    })

    watch(watchable, () => {
        if (!presentRef.value) {
            missed.value++
        }
    })


    const clear = () => {
        missed.value = 0
    }

    return { missed, clear }
}