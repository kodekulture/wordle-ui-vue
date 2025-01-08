<template>
  <div class="flex flex-col justify-around md:justify-between h-full w-full md:py-12 items-center">
    <div @mouseover="focusInput">
      <ul>
        <li v-for="(guess, index) in guesses" :key="`${guess.word}-${guess.status}-${index}`">
        <guess-view :guess="guess" />
        </li>
        <li v-if="showInput">
          <guess-input ref="input" :disabled="ended" />
        </li>
        <li v-for="i in guessesLeft" :key="`remaining-guess-${i}`">
          <guess-view :guess="{}" />
        </li>
      </ul>
    </div>
  <game-keyboard class="w-full" />
  </div>
</template>

<script setup lang="ts">
import {MAX_GUESSES} from "~/utils";
import {computed} from "vue";
import type {GuessInput} from "#components";

const props = defineProps<{game: Game | null}>()

// refs
const input = ref(null)
const store = useGameStore()
const { myGuesses } = storeToRefs(store);
const guesses = computed(() => {
  if(props.game) {
    return props.game.guesses ?? []
  }
  return myGuesses.value
})

const guessesLeft = computed(() => Math.max(0, MAX_GUESSES - guesses.value.length - 1))
const showInput = computed(() => MAX_GUESSES > guesses.value.length)
const ended = computed<boolean>(() => props.game?.ended_at != null)

function focusInput() {
  if (input?.value && !ended.value) {
    input?.value.focusInput()
  }
}
</script>