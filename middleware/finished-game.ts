import {useFinishedGameStore} from "~/stores/finishedGameStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const store = useFinishedGameStore()
    const { game } = storeToRefs(store)

    const id = to.params?.id
    const isFinished = to.query.finished != null

    if (!id) {
        return abortNavigation('game must have a valid id')
    }

    await store.load(id)

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