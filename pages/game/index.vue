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
  <UModal v-model="showModal">
    <div class="p-2 m-2 flex flex-col items-center justify-center">
      <UInput v-model="gid" variant="outline" placeholder="Game UUID..." size="lg" class="mb-8" />
      <UButton @click="joinGame">Join Game</UButton>
    </div>
  </UModal>
  <div class="float-right z-10 absolute bottom-3 right-3 flex flex-col">
    <UButton @click="createGame" class="mb-4 rounded-xl justify-center">Create New Game</UButton>
    <UButton @click="showModal = true" class="rounded-xl flex justify-center">Join Game</UButton>
  </div>
  
</template>

<script lang="ts" setup>
import { storeToRefs, useGamesStore, computed, navigateTo, definePageMeta, showToastError } from '#build/imports';
const gamesStore = useGamesStore()
const showModal = ref(false)
const { games, error, loading, last_fetched } = storeToRefs(gamesStore);
const updated = computed(() => last_fetched.toString())
const gid = ref('')
await gamesStore.refresh()
if (error.value) {
  showToastError(error.value)
}

const createGame = async () => {
  const id = await gamesStore.create()
  await navigateTo(`/game/${id}`)
}

const joinGame = async () => await navigateTo(`/game/${gid.value}`)

definePageMeta({
  middleware: 'auth'
})
</script>

<style></style>