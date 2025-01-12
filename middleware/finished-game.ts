import {useFinishedGameStore} from "~/stores/finishedGameStore";
import {useGameStore} from "~/stores/gameStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const finishedStore = useFinishedGameStore()
    const store = useGameStore()
    const { game } = storeToRefs(finishedStore)

    const id = to.params?.id
    const isFinished = to.query.finished != null

    if (!id) {
        return abortNavigation('game must have a valid id')
    }
    
    await finishedStore.load(id)
    store.$reset()

    const actualFinish = game.value?.ended_at != null
    if (!isFinished && actualFinish) {
        console.log('game has actually finished, setting query to true')
        return navigateTo({
            path: to.path,
            query: {
                ...to.query,
                finished: 'true',
            }
        })
    } else if (isFinished && !actualFinish) {
        console.log('game on!!! deleting finished from URL')
        return navigateTo({
            path: to.path,
            query: {
                ...to.query,
                finished: undefined,
            }
        })
    }

    return true
})