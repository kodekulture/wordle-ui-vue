<template>
  <div class="flex flex-col justify-between h-full py-12 items-center">
    <div class="">
  <ul>
  <li v-for="guess in myGuesses">
  <guess-view :guess="guess" />
  </li>
  <li v-if="showInput">
    <guess-input />
  </li>
  <li v-for="i in guessesLeft" :key="`remaining-guess-${i}`">
    <guess-view :guess="{}" />
  </li>
  </ul>
    </div>
  <game-keyboard />
  </div>
</template>

<script setup lang="ts">
import {MAX_GUESSES} from "~/utils";

const store = useGameStore()
const { myGuesses } = storeToRefs(store);

const guessesLeft = computed(() => Math.max(0, MAX_GUESSES - myGuesses.value.length - 1))
const showInput = computed(() => MAX_GUESSES > myGuesses.value.length)
</script>