import { defineStore } from 'pinia'
import {type Game, gameFactory} from '~/api/game';
import {useFetchApi} from "~/composables/use-fetch-api";
import type {AsyncDataExecuteOptions} from "#app/composables/asyncData";

export const useGamesStore = defineStore('useGamesStore',  () => {
  const games = computed<Game[]>(() => data.value ?? [])
  const last_fetched = ref<Date | null>(null);
  const {data, error, refresh: _refresh, status } = useFetchApi<Game[]>(`/room`, {cache: false})
  const loading = computed(() => status.value === 'pending')

  async function refresh(opts?: AsyncDataExecuteOptions) {
    await _refresh(opts)
    if (!error.value) {
      last_fetched.value = new Date();
    }
  }

  return {
    status,
    games,
    last_fetched,
    error,
    loading,
    refresh,
  }
})

export const useCreateGameStore = defineStore('createGameStore', () => {
  const loading = ref(false)
  const error = emit<string>(null)
  const data = ref<{id: string}>(null)

  const create = async () => {
    try {
      loading.value = true
      const { id } = await gameFactory.createRoom()
      data.value = {id}
    } catch(e: Error) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const id = computed<string | null>(() => data.value?.id)
  watch(data, () => {
    console.log(`Data from createGame ${JSON.stringify(data.value)} ${Date.now()}`)
  })
  return {
    id,
    error,
    loading,
    create,
  }
})