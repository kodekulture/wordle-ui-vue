import { defineStore } from 'pinia'
import { gameFactory, type Game } from '../api/game'
import { ref } from '#imports'

export const useGameStore = defineStore('useGameStore', () => {
  const gameId = ref<string | null>(null);
  const joinToken = ref<string | null>(null);
  const error = ref<string | null>(null);

  const join = async (id: string) => {
    try {
      const {token} = await gameFactory.joinRoom(id);
      gameId.value = id;
      joinToken.value = token;
    } catch (e) {
      console.error(e);
      error.value = 'failed to join game'
    }
  }
  return {
    gameId,
    joinToken,
    error,
    join
  }
})