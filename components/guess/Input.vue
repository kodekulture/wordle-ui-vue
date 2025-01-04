<template>
  <guess-view v-if="true" :class="{shake: failedValidation}" :guess="guess" />
  <input type="text"
         autofocus
         v-model="currentWord"
         @keydown.enter="play"
         @keydown="isLetter($event)"
         :maxlength="WORD_LENGTH"
  @blur="({target}) => (target as HTMLInputElement).focus()" />
</template>

<script setup lang="ts">
const store = useGameStore()
const { currentWord, playError, active } = storeToRefs(store);
const guess = computed<WordGuess>(() => ({word: currentWord.value}))
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

const failedValidation = computed(() => playError.value != null)

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