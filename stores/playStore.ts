import { defineStore } from 'pinia'
import {onUnmounted, useAppConfig, useWebSocket, watch} from '#imports'

export const usePlayStore = defineStore('usePlayStore', () => {
  const game = useGameStore();
  const config = useAppConfig()
  const {status, data, send, close} = useWebSocket(`ws://${config.public!.baseURL!}/live`)
  
  watch(data, () => {
    console.log(data.value);
  })

  return {
    status,
    close,
    send,
  };
})
