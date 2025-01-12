import {defineStore} from "pinia";
import type {Game} from "~/api/game";
import {gameFactory} from "~/api/game";

export const useFinishedGameStore = defineStore('useFinishedGameStore', () => {
    const game = shallowRef<Game | null>(null)
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    async function load(id: string) {
        $reset()
        try {
            loading.value = true;
            game.value = await gameFactory.room(id)
        } catch (e) {
            error.value = `Failed to retrieve game data for id: ${id}`
        } finally {
            loading.value = false;
        }
    }

    const $reset = () => {
        game.value = null;
        loading.value = false;
        error.value = null;
    }

    return {
        loading,
        error,
        game,
        load,
    }
})
