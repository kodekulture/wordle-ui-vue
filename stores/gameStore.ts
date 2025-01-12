import {useRuntimeConfig} from '#app';
import {defineStore, storeToRefs} from 'pinia';
import {convertToWebSocketURL, DEBOUNCE_TIMER, WORD_LENGTH} from '~/utils'
import type {Leaderboard, PlayerGuessResponse, WordGuess, Game} from '~/api/game';
import { useWebSocket } from "@vueuse/core";
import useCustomDebounce from "~/composables/use-custom-debounce";
import {gameFactory} from "~/api/game";

export const useGameStore = defineStore('useGameStore', () => {
    const gameId = ref<string | null>(null);
    const joinToken = ref<string | null>(null);
    const error = ref<string | null>(null);
    const playError = emit<string>(null);
    const _loading = ref(true);
    const active = ref(false);
    const gameOwner = ref<string | null>(null);
    const config = useRuntimeConfig();

    const socketURL = computed(() => `${convertToWebSocketURL(config.public.baseURL)}/live?token=${joinToken.value}`)
    const {user} = storeToRefs(useAuthStore())
    const owner = computed(() => gameOwner.value == null ||
    user.value?.username == null ? null : gameOwner.value === user.value?.username)

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


    const {status, data, send} = useWebSocket(socketURL,
        { immediate: false })
    watch(status, () => {
        console.log(`The current status is ${status.value}`);
    })

    const loading = computed(() => _loading.value || status.value === 'CONNECTING')

    const join = async (id: string) => {
        _loading.value = true;
        try {
            const {token} = await gameFactory.joinRoom(id);
            gameId.value = id;
            joinToken.value = token;
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

        let msg: string = ''
        switch (obj.event) {
            case 'client/start':
                active.value = true;
                messages.value.push({from: 'server', data: 'game has started'})
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
                msg = `Welcome to ${respons.data.creator}'s game room.\n`
                if (respons.data.active) {
                    msg += `Game ON!! 🚀 Start making guesses and watch the leaderboard. ))`
                } else {
                    msg += `Game has not started yet. Waiting for owner to start game.`
                }

                messages.value.push({from: 'server', data: msg})

                leaderboard.value = respons.data.game_performance ?? []
                active.value = respons.data.active
                gameOwner.value = respons.data.creator
                myGuesses.value = respons.data.guesses ?? []
                console.log(`game is active?: ${respons.data.active}`)
                break;
            case 'client/error':
                const respon = (obj as Message)
                playError.value = respon.data
                break;
            case 'client/finish':
                msg = 'Game has already ended. You should start a new game with your friends and keep having fun 🤩.'
                messages.value.push({from: 'server', data: msg})
                break;
        }

        console.log(data.value);
    })


    const start = () => {
        send(JSON.stringify({event: 'server/start'}))
    }

    const message = (s: string) => {
        send(JSON.stringify({event: 'server/message', data: s}))
    }

    const {status: play_status, remaining: play_remaining, execute: play, data: play_data } = useCustomDebounce(() => {
        if (status.value !== 'OPEN') {
            return false
        }
        const ts = new Date().toISOString()
        return send(JSON.stringify({event: 'server/play', data: currentWord.value, key: ts}), false)
    }, DEBOUNCE_TIMER)

    const reconnect = () => {
        console.log(gameId.value)
        close()
        join(gameId.value)
    }

    return {
        error,
        messages,
        currentWord,
        status, // for loading state, use `loading`, for connection status, use `status`
        loading,
        leaderboard,
        active,
        owner,
        myGuesses,
        playError,
        play_status,
        play_remaining,
        play_data,
        join,
        start,
        message,
        play,
        reconnect,
    }
})

interface Event {
    from: string;
    event: string;
}

export interface Message extends Event {
    data: string;
    from: 'server' | string;
    time: Date;
}

interface Play extends Event {
    data: PlayerGuessResponse;
}

interface DataEvent extends Event {
    data: Data
}

type Data = Game & { active: boolean }