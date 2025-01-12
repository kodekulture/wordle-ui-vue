<template>
  <div v-if="loading" v-for="_ in 5">
    <div class="p-2 m-2 border border-gray-500 flex flex-row items-center">
      <div class="p-2 flex w-full flex-col gap-2">
        <USkeleton class="w-1/2 h-4" />
        <USkeleton class="w-7/12 h-8" />
        <USkeleton class="w-9/12 h-4" v-for="_ in 3" />
      </div>
    </div>
  </div>
  <div v-else-if="games.length == 0" class="flex p-8 justify-center">
    Empty list of games
  </div>
  <div v-else v-for="game in games">
    <div class="p-2 m-2 border border-gray-500 flex flex-row items-center" @click="joinExisting(game.id)">
      <div class="p-2">
        <div class="text-ellipsis text-xl">{{ game.id }}</div>
        <div class="text-lg font-bold font-serif">{{ game.creator }}</div>
      </div>
      <div v-if="game.ended_at" class="flex flex-col">
        <span>
          Finished at {{ game.ended_at }}
        </span>
        </div>
      </div>
    </div>
    <div class="z-10 fixed bottom-3 right-3 flex flex-col">
      <UButton @click="createGame" :loading="create_loading" :disabled="create_loading" class="mb-4 rounded-xl justify-center">Create New Game</UButton>
      <UButton @click="showModal = true" class="rounded-xl flex justify-center">Join Game</UButton>
    </div>

  <UModal v-model="showModal">
    <div class="p-2 m-2 w-full flex flex-col items-center justify-center">
      <UInput v-model="gid" variant="outline" placeholder="Game UUID..." size="lg" class="mb-8 w-full" />
      <UButton @click="joinGame">Join Game</UButton>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import {useCreateGameStore,useGamesStore} from "~/stores/gamesStore";

const gamesStore = useGamesStore()
const { games, error, last_fetched, loading } = storeToRefs(gamesStore);
watch(error, () => {
  if (error.value) {
    showToastError(`Failed to fetch game lists\n${error.value}`)
  }
})

const createGameStore = useCreateGameStore()
const { id: newGameId, error: create_error, loading: create_loading } = storeToRefs(createGameStore)
const createGame = async () => {
  await createGameStore.create()
  if (newGameId.value) {
    console.log(`new Game ${newGameId.value}`)
    await navigateTo(`/game/${newGameId.value}`)
    return
  }
  showToastError(create_error.value)
}

const showModal = ref(false)
const gid = ref('')
const joinGame = async () => await navigateTo(`/game/${gid.value}`)
const joinExisting = async (id) => await navigateTo(`/game/${id}?finished=true`)

const updated = computed(() => last_fetched?.value.toString())

definePageMeta({
  middleware: 'auth'
})
useHead({
  title: 'Games'
})
</script>

<style></style>