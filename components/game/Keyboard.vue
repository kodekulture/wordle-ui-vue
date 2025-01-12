<template>
<div class="flex flex-col items-center w-full grow-0">
  <div v-for="row in rows" class="row">
    <game-key
        class="flex-shrink-0 flex-grow"
        v-for="l in row" :letter="l"
        :status="colors[l]"
        :class="l === 'ENTER' ? 'w-8' : 'w-4'"
        @click="update(l)" />
  </div>
</div>
</template>

<script setup lang="ts">
const store = useGameStore()
const { myGuesses, active, currentWord, playError, play_status, play_remaining, play_data } = storeToRefs(store)
watch(play_data, () => {
  if (play_data.value != null && !play_data.value) {
    showToastError('word was not sent, try reloading the webpage and try again.')
  }
})

const colors = computed(() => {
  const obj: Record<string, number> = {}
  myGuesses.value.forEach(guess => {
    const len = guess?.word?.length ?? 0
    for (let i = 0; i < len; i++) {
      const word = guess.word[i]
      const status = guess.status.at(i) ?? 0
      obj[word] = Math.max(obj[word] ?? 0, status)
    }
  })
  return obj
})

function showError(msg: string) {
  showToastError(msg)
  playError.value = msg
}

function play() {
  if ((currentWord.value?.length ?? 0) < WORD_LENGTH) {
    showError('enter five letter word')
    return;
  }
  store.play()
}
function update(letter: string) {
  if (!active.value) {
    showError('game has not started yet')
    return;
  }
  if (letter === 'ENTER') {
    play()
  } else if (letter === '⌫') {
    currentWord.value = currentWord.value.slice(0, -1)
  } else {
    currentWord.value += letter
  }
}
const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]
</script>

<style scoped>
.row {
  @apply flex justify-center flex-nowrap w-full shrink;
}
</style>