<template>
  <ul class="list-none p-0 flex gap-1 mt-1">
    <li
      v-for="(letter, index) in letters"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      :data-letter-status="statuses.at(index)"
      v-text="letter"
      :class="{ 'with-flips': props.guess.played_at }"
      class="letter"
    />
  </ul>
</template>
<script lang="ts" setup>
import type { WordGuess } from "~/api/game";

const props = defineProps<{ guess: WordGuess }>();
const letters = computed(() =>
  (props.guess?.word ?? "").padEnd(WORD_LENGTH, " "),
);
const statuses = computed(() => {
  const statuses = { 1: "incorrect", 2: "almost", 3: "correct" };
  return (props.guess?.status ?? <number>[]).map((status) => statuses[status]);
});
</script>

<style lang="scss" scoped>
$gray: #676767;

.letter {
  --front-color: #959595;
  --back-color: $gray;
  background-color: var(--front-color);
  border-color: $gray;
  @apply border border-solid size-16 flex justify-center items-center text-4xl font-[bolder] text-white;

  @media (prefers-color-scheme: dark) {
    --front-color: #1c1c1c;
  }
}

li:not([data-letter=" "]) {
  animation: pop 100ms;
}

[data-letter-status="correct"] {
  --back-color: hsl(120, 25%, 65%);
}

[data-letter-status="almost"] {
  --back-color: hsl(40, 65%, 48%);
}

[data-letter-status="incorrect"] {
  --back-color: #676767;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.4);
  }
}

@keyframes flip-card {
  0% {
    transform: rotateY(0);
    background-color: var(--front-color);
  }

  49% {
    background-color: var(--front-color);
  }

  50% {
    transform: rotateY(-90deg);
    background-color: var(--back-color);
  }

  100% {
    transform: rotateY(0);
    background-color: var(--back-color);
  }
}

$maxWordSize: 5;

@for $i from 1 through $maxWordSize {
  .with-flips:nth-of-type(#{$i}) {
    animation: flip-card 300ms forwards;
    animation-delay: #{250 * $i}ms;
  }
}
</style>
