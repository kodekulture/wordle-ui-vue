import { useRuntimeConfig } from '#app';
import { useWebSocket, watch } from '#build/imports';
import { defineStore, storeToRefs } from 'pinia';
// import { ref, computed, reactive } from '#imports';
import { WORD_LENGTH } from '~/utils';
import {Game, gameFactory} from '~/api/game';
import type {PlayerGuessResponse, Leaderboard, WordGuess} from '~/api/game';

export const useGameStore = defineStore('useGameStore', () => {
  const gameId = ref<string | null>(null);
  const joinToken = ref<string | null>(null);
  const error = ref<string | null>(null);
  const playError = ref<string | null>(null);
  const _loading = ref(true);
  const active = ref(false);
  const gameOwner = ref<string | null>(null);
  const config = useRuntimeConfig();

  const socketURL = computed(() => `ws://${trimScheme(config.public.baseURL)}/live?token=${joinToken.value}`)
  const { user } = storeToRefs(useAuthStore())
  const owner = computed(() => gameOwner.value == null || user.value?.username == null ? null : gameOwner.value === user.value?.username)

  const messages = ref<Message[]>([]);
  const _word = ref<string | null>(null);
  const currentWord = computed<string>({
    set: (v: string) => {
      if (v.length > WORD_LENGTH) {
        return;
      }
      _word.value = v.toUpperCase().replace(/[^A-Z]+/gi, '')
    },
    get: () => _word.value ?? '',
  })
  const myGuesses = ref<WordGuess[]>([]);
  const leaderboard = ref<Leaderboard>([]);


  const { status, data, open, send } = useWebSocket(socketURL, { immediate: false })

  const loading = computed(() => _loading.value || status.value === 'CONNECTING')


  const join = async (id: string) => {
    _loading.value = true;
    try {
      const { token } = await gameFactory.joinRoom(id);
      gameId.value = id;
      joinToken.value = token;
      open()
      console.log('setting token')
    } catch (e) {
      console.error(e);
      error.value = 'failed to join game'
      setTimeout(() => error.value = null, 200)
    } finally {
      _loading.value = false;
    }
  }

  watch(data, () => {
    const obj: { event: string, from: string } = JSON.parse(data.value);

    switch (obj.event) {
      case 'client/start':
        active.value = true;
        console.log('game has started');
        break;
      case 'client/message':
        messages.value.push(obj as Message);
        break;
      case 'client/play':
        const response = obj as Play
        leaderboard.value = response.data.leaderboard
        if (response.from === user.value?.username) {
          myGuesses.value.push({...response.data.result, word: currentWord.value})
          currentWord.value = ''
        } else {
          console.log(`Other player: ${obj.from}: ${JSON.stringify(obj as Play)}`)
        }
        break;
      case 'client/data':
        const respons = obj as DataEvent
        leaderboard.value = respons.data.leaderboard
        active.value = respons.data.active
        gameOwner.value = respons.data.creator
        myGuesses.value.splice(0, myGuesses.length, ...(respons.data.guesses ?? []))
        console.log(`game is active?: ${respons.data.active}`)
            break;
      case 'client/error':
        const respon = (obj as Message)
        playError.value = respon.data
        setTimeout(() => playError.value = null, 200)
        break;
      case 'client/finish':
        close()
        console.log('game has ended and socket is closed')
            break;
    }

    console.log(data.value);
  })

  const start = () => {
    send(JSON.stringify({ event: 'server/start' }))
  }

  const message = (s: string) => {
    send(JSON.stringify({ event: 'server/message', data: s }))
  }

  const play = () => {
    send(JSON.stringify({ event: 'server/play', data: currentWord.value }))
  }

  return {
    error,
    messages,
    currentWord,
    loading,
    leaderboard,
    active,
    owner,
    myGuesses,
    playError,
    join,
    start,
    message,
    play,
  }
})

interface Event {
  from: string;
  event: string;
}

export interface Message extends Event {
  data: string;
  time: Date;
}

interface Play extends Event {
  data: PlayerGuessResponse;
}

interface DataEvent extends Event {
  data: Data
}

type Data = Game & {active: boolean}