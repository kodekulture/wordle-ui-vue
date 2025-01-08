import { defineStore } from 'pinia'
import { type Game } from '~/api/game';
import {useFetchApi} from "~/composables/use-fetch-api";
import type {AsyncDataExecuteOptions} from "#app/composables/asyncData";

export const useGamesStore = defineStore('useGamesStore',  () => {
  const {data, error, refresh: _refresh, status } = useFetchApi<Game[]>('/room')
  const games = computed<Game[]>(() => data.value ?? [])
  const last_fetched = ref<Date | null>(null);

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
    refresh,
  }
})

export const useCreateGameStore = defineStore('createGameStore', () => {
  const { data, status, error, refresh } = useFetchApiLazy<{id: string}>('/room', {
    method: 'POST',
    immediate: false,
    cache: false,
  })
  const id = computed<string | null>(() => data.value?.id)
  watch(data, () => {
    console.log(`Data from createGame ${JSON.stringify(data.value)} ${Date.now()}`)
  })
  return {
    id,
    error,
    status,
    refresh,
  }
})