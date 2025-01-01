<template>
  <div v-if="loading" v-for="n in 10">
    <div class="p-2 m-2 border border-gray-500 flex flex-row items-center">
      <div class="p-2">
        <USkeleton class="text-ellipsis text-xl" />
        <USkeleton class="text-lg font-bold font-serif" />
      </div>
      <USkeleton class="flex flex-col" />
    </div>
  </div>
  <div v-if="games.length == 0" class="flex justify-center">
    Empty list of games
  </div>
  <div v-else v-for="game in games">
    <div class="p-2 m-2 border border-gray-500 flex flex-row items-center">
      <div class="p-2">
        <div class="text-ellipsis text-xl">{{ game.id }}</div>
        <div class="text-lg font-bold font-serif">{{ game.creator }}</div>
      </div>
      <div v-if="game.ended_at" class="flex flex-col">
        <span>
          Finished at {{ game.ended_at }}
        </span>
        <!-- <vue-moments-ago prefix="last updated" suffix="ago" :date="updated" />  -->
      </div>
    </div>
  </div>
  <UButton class="float-right z-10 absolute bottom-3 right-3">Create New Game</UButton>
</template>

<script lang="ts" setup>
import { storeToRefs, useGamesStore, computed, useToast } from '#build/imports';
// import VueMomentsAgo from "vue-moments-ago";

const gamesStore = useGamesStore()
const toast = useToast()
const { games, error, loading, last_fetched } = storeToRefs(gamesStore);
const updated = computed(() => last_fetched.toString())
await gamesStore.refresh()
if (error.value) {
  toast.add({ title: error.value, icon: 'i-heroicons-solid-exclamation-triangle', color: 'red' })
}

</script>

<style></style>