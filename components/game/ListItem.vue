<template>
  <div class="w-full p-2 m-2 border rounded-lg border-gray-500 flex flex-row items-center shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
       @click="joinExisting(this, game.id)">
    <div class="w-1/2 p-2 flex-1">
      <div class="inline-flex items-center justify-start" @click="copyId">
        <div class="text-sm font-semibold truncate">Game ID: {{ game.id }}</div>
        <UIcon class="ml-1" name="material-symbols:content-copy"/>
      </div>
      <div class="text-md text-gray-600 font-serif">Created by: {{ game.creator }}</div>
      <div v-if="game.ended_at && detail">
        <span v-for="(letter, i) in detail.correct_word" class="txt font-bold text-lg" :data-status="statuses[str[i]]">
          {{letter}}
        </span>
      </div>
      <div v-else-if="status === 'pending'">Loading...</div>
      <div v-else> ... </div>
    </div>
    <div v-if="game.ended_at" class="max-w-1/3 flex-1 text-right text-sm text-gray-700 flex flex-col">
      <ClientOnly>
        <span class="text-green-600 font-medium">
          Finished at {{ new Date(game.ended_at).toLocaleString() }}
        </span>
      </ClientOnly>
      <div class="mt-2 flex flex-wrap gap-2 justify-end text-right">
        <span v-if="status === 'pending'">Loading...</span>
        <div v-else class="justify-end flex flex-col">
          <div class="rank text-right">#{{ myGuess.rank + 1}}/{{ detail.game_performance.length }}</div>
          <best-guess-bar :leaderboard="detail.game_performance.slice(0, 3)" size="sm"/>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-end mr-2">
        Continue
      <UIcon name="iconamoon:enter-bold" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Game} from "~/api/game";
import {useFetchApiLazy} from "~/composables/use-fetch-api";
import {useAuthStore} from "#imports";
import BestGuessBar from "~/components/game/leaderboard/BestGuessBar.vue";
const props = defineProps<{ game: Game }>()
const joinExisting = async (el, id) => {
  await navigateTo(`/game/${id}?finished=true`)
}
const { user } = storeToRefs(useAuthStore())
const statuses = {1: 'incorrect', 2: 'almost', 3: 'correct'}
const { data, status, refresh, error } = useFetchApiLazy<Game>(`/room/${props.game.id}`,
    {immediate: false, server: false,
      pick: ['guesses', 'game_performance', 'correct_word'],
    })
const copyId = () => {
  window.event?.stopPropagation()
  const {copy} = useClipboard()
  copy(props.game.id)
  alert('Game id copied to clipboard')
}
const detail = computed<Game>(() => data.value)
const myGuess = computed<PlayerSummary>(() =>
    detail.value.game_performance!.find(it => it.username === user?.value?.username))
const str = computed(() => myGuess.value.best.status)
if (props.game.ended_at) {
  refresh()
}
</script>

<style scoped>
.rank {
  @apply font-black text-green-500 tracking-widest text-lg;
}
.txt {
  --back-color: #676767;
  color: var(--back-color);
}
[data-status=almost] {
  --back-color: hsl(40, 65%, 48%);
}
[data-status=correct] {
  --back-color: hsl(120, 25%, 65%);
}
</style>