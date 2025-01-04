<template>
<div class="flex flex-col items-center">
  <div v-for="row in rows" class="row">
    <game-key v-for="l in row" :letter="l" :status="colors[l]"
              @click="update(l)" />
  </div>
</div>
</template>

<script setup lang="ts">
const store = useGameStore()
const { myGuesses, active, currentWord } = storeToRefs(store)
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

function play() {
  if (!active.value) {
    showToastError('game has not started yet')
    return;
  }
  if ((currentWord.value?.length ?? 0) < WORD_LENGTH) {
    showToastError('enter five letter word')
    return;
  }
  store.play()
}
function update(letter: string) {
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
  @apply flex justify-center;
}
</style>