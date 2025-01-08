<template>
  <div class="relative p-2 h-full flex flex-col min-h-0">
    <!-- Large and Medium Screen Layout -->
    <div class="hidden md:flex h-full w-full min-h-0">
      <!-- Game Board -->
      <game-board
          :game="game"
          class="flex-grow md:w-1/2 flex justify-between items-center min-h-0 overflow-auto"
      />

      <UDivider orientation="vertical"/>
      <!-- Medium Screen Layout: Chat and Leaderboard Stacked Vertical -->
      <div class="hidden md:flex md:flex-col md:w-1/2 lg:w-1/3 min-h-0">
        <!-- Leaderboard Section -->
        <game-leader-board class="flex-1 min-h-0 overflow-auto"/>
        <UDivider class="block lg:hidden" size="md"/>
        <!-- Medium Screen ONLY: Chat Section -->
        <game-chat
            v-if="!ended"
            class="flex-1 grow shrink-0 flex justify-center items-center lg:hidden min-h-0 overflow-auto"
        />
      </div>

      <!-- Large Screen Layout only: Chat Section -->
      <game-chat
          v-if="!ended"
          class="hidden lg:flex lg:w-1/3 bg-black-500 justify-center items-center min-h-0 overflow-auto"
      />
    </div>
    <UModal v-model="showLoading" prevent-close>
      <div class="p-4 flex flex-col items-center justify-center">
        <span class="mb-4">Loading...</span>
        <UProgress animation="carousel" />
      </div>
    </UModal>
    <UModal v-model="showError" prevent-close>
        <div class="p-4 flex flex-col justify-center">
          <span class="text-wrap mb-4">{{shownError}}</span>
          <UButton @click="navigateTo('/game')" class="justify-center">Exit</UButton>
        </div>
    </UModal>
    <UModal v-model="showStart" prevent-close>
      <div :hidden="!notActive">
        <div class="p-4 w-full h-full z-10">
          <div v-if="owner" class="flex flex-col items-center justify-center h-full">
            <span class="mb-4">Players are waiting for you to start the game...</span>
            <UButton @click="store.start">Start</UButton>
          </div>
          <div v-else-if="owner != null && !owner">
            <span class="mb-4">Waiting for owner to start game...</span>
            <UProgress animation="carousel" />
          </div>
        </div>
      </div>
    </UModal>
    <!-- Mobile Layout -->
    <div class="block h-full md:hidden min-h-0">
      <!-- Game Board -->
      <game-board
          :game="game"
          class="h-full flex justify-between items-center min-h-0 overflow-auto"
      />

      <!-- Floating Buttons -->
      <div class="absolute top-4 right-4 flex flex-col gap-2 z-50">
        <UButton @click="activeOverlay = 'chat'" label="Chats"/>
        <UButton @click="activeOverlay = 'leaderboard'" label="LeaderBoard"/>
      </div>

      <!-- Overlay -->
      <USlideover v-model="overlayPresent">
        <UButton
            color="gray"
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark-20-solid"
            class="flex sm:hidden absolute end-5 top-5 z-10"
            square
            padded
            @click="activeOverlay = null"
        />
        <div v-if="activeOverlay == 'chat'" class="min-h-0 overflow-auto">
          <game-chat/>
        </div>
        <div
            v-if="activeOverlay == 'leaderboard'"
            class="min-h-0 overflow-auto"
        >
          <game-leader-board/>
        </div>
      </USlideover>
    </div>
  </div>
</template>


<script lang="ts" setup>
// Game LOGIC
import {storeToRefs} from 'pinia'
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useFinishedGameStore} from "~/stores/finishedGameStore";


const {params, query} = useRoute()
const id = params.id
const finished = query.finished

const store = useGameStore()
const {game, error: finished_error} = storeToRefs(useFinishedGameStore())
if (!finished) {
  store.join(id)
}

const {loading, error, active, owner} = storeToRefs(store)
const notActive = computed(() => !loading.value && !active.value)
const ended = computed<boolean>(() => game.value?.ended_at != null)
const showLoading = computed(() => ended.value ? false : loading.value)

const shownError = computed<string | null>(() => {
  return ended.value ? finished_error.value : error.value
})

const showError = computed<boolean>(() => shownError.value != null)
const showStart = computed<boolean>(() => !active.value && !showError.value && !showLoading.value)

watch(error, () => {
  if (error.value == null) return;
  showToastError(error.value)
})

definePageMeta({
  middleware: ['auth', 'finished-game']
})

// Display LOGIC
const activeOverlay = ref<null | 'chat' | 'leaderboard'>(null)
const overlayPresent = computed(() => activeOverlay.value != null)
</script>