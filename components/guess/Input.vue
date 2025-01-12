<template>
    <guess-view :class="{shake: shaking}" :guess="guess"/>
    <input type="text"
           ref="input"
           autofocus
           v-model="currentWord"
           @keydown.enter="play"
           @keydown="isLetter($event)"
           :disabled="disabled"
           :maxlength="WORD_LENGTH"/>
  <UProgress v-if="play_status === 'debouncing'" :value="DEBOUNCE_TIMER - play_remaining" :max="DEBOUNCE_TIMER"/>
  <UProgress animation="carousel" v-else-if="play_status === 'executing'"/>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>()

const store = useGameStore()
const {currentWord, playError, play_status, play_remaining, active} = storeToRefs(store);
const guess = computed<WordGuess>(() => ({word: currentWord.value}))
const input = ref<HTMLInputElement | null>(null)
const shaking = computed(() => playError.value != null)

onStartTyping(() => {
  if (!input.value.active)
    input.value.focus()
})

function play() {
  if (!active.value) {
    showToastError('game has not started yet')
    return;
  }
  if (currentWord.value.length < WORD_LENGTH) {
    showToastError('enter five letter word')
    return;
  }
  store.play()
}

function isLetter(e) {
  let char = String.fromCharCode(e.keyCode)
  if (/[A-Za-z\b]/.test(char)) {
    return true
  }
  e.preventDefault()
}
</script>

<style scoped>
input {
  @apply absolute opacity-0;
}

.shake {
  animation: shake;
  animation-duration: 100ms;
  animation-iteration-count: 2;
}

@keyframes shake {
  0% {
    transform: translateX(-2%);
  }

  25% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(2%);
  }

  75% {
    transform: translateX(0);
  }
}
</style>