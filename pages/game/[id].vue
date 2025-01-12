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
      <div class="hidden md:flex md:flex-col md:w-1/2 lg:w-1/4 min-h-0">
        <!-- Leaderboard Section -->
        <game-leader-board/>
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
    <!-- Mobile Layout -->
    <div class="flex flex-col h-full w-full md:hidden min-h-0">
      <!-- Navbar -->
      <div class="relative flex w-full rounded-lg h-8 justify-around items-center bg-gray-800 text-white">
        <!-- Animated indicator -->
        <div class="absolute left-0 w-1/3 h-full rounded-lg bg-primary transition-transform duration-300"
             :style="{ transform: `translateX(${activeIndex*100}%)`}"/>
        <u-chip class="relative flex flex-1 items-center justify-center z-10 px-4 py-2" :text="missedLeaderboard"
                size="2xl" :show="missedLeaderboard > 0" inset>
          <button @click="switchTab(0)">Leaderboard</button>
        </u-chip>
        <button class="relative flex flex-1 items-center justify-center z-10 px-4 py-2" @click="switchTab(1)">Game
        </button>
        <u-chip class="relative flex flex-1 items-center justify-center z-10 px-4 py-2" :text="missedMsgs" size="2xl"
                :show="missedMsgs > 0" inset>
          <button @click="switchTab(2)">Chat</button>
        </u-chip>
      </div>

      <!-- Page Content -->
      <div class="min-h-0 flex-1 grow overflow-auto">
        <transition name="fade" mode="out-in">
          <div v-if="activePage === 'chat'" class="h-full min-h-0 overflow-auto" key="chat">
            <div v-if="ended">
              Game has Ended
            </div>
            <game-chat v-else/>
          </div>
          <div v-else-if="activePage === 'game'" class="h-full min-h-0 overflow-auto" key="game">
            <game-board :game="game"/>
          </div>
          <div v-else-if="activePage === 'leaderboard'" class="h-full min-h-0 overflow-auto" key="leaderboard">
            <game-leader-board/>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <UModal v-model="showLoading" prevent-close>
    <div class="p-4 flex flex-col items-center justify-center">
      <span class="mb-4">Loading...</span>
      <UProgress animation="carousel"/>
    </div>
  </UModal>
  <UModal v-model="showError" prevent-close>
    <div class="p-4 flex flex-col justify-center">
      <span class="text-wrap mb-4">{{ shownError }}</span>
      <UButton @click="navigateTo('/game')" class="justify-center">Exit</UButton>
    </div>
  </UModal>
  <UModal v-model="showStart" prevent-close>
    <div v-if="notActive">
      <div class="p-4 w-full h-full z-50">
        <div class="flex flex-wrap w-full items-center">
          <TransitionGroup name="list"></TransitionGroup>
          <p>Players: </p>
          <UBadge v-for="gamer in players" :label="gamer" :key="gamer" class="m-1" :icon="gamer === gameOwner ? 'i-heroicons-rocket-launch' : ''" />
        </div>
        <div v-if="owner" class="flex flex-col items-center justify-center h-full">
          <span class="mb-4">Players are waiting for you to start the game...</span>
          <UButton @click="store.start">Start</UButton>
        </div>
        <div v-else-if="owner != null && !owner">
          <span class="mb-4">Waiting for owner to start game...</span>
          <UProgress animation="carousel"/>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center">
      An error occurred, please try again later.
    </div>
  </UModal>
</template>


<script lang="ts" setup>
// Game LOGIC
import {storeToRefs} from 'pinia'
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useFinishedGameStore} from "~/stores/finishedGameStore";
import {breakpointsTailwind} from "@vueuse/core";

const {params, query} = useRoute()
const id = params.id
const finished = query.finished

const store = useGameStore()
const {game, error: finished_error} = storeToRefs(useFinishedGameStore())
if (!finished) {
  store.join(id)
}

const {messages, leaderboard, loading, status, error, active, owner, gameOwner, players} = storeToRefs(store)
const notActive = computed(() => !loading.value && !active.value)
const ended = computed<boolean>(() => game.value?.ended_at != null)
const showLoading = computed(() => ended.value ? false : loading.value)

const shownError = computed<string | null>(() => {
  return ended.value ? finished_error.value : error.value
})

const showError = computed<boolean>(() => shownError.value != null)
const showStart = computed<boolean>(() => !active.value &&
    !showError.value &&
    !showLoading.value &&
    status.value === 'OPEN')

watch(error, () => {
  if (error.value == null) return;
  showToastError(error.value)
})

definePageMeta({
  middleware: ['auth', 'finished-game']
})

useHead({
  title: 'Game Room'
})

// TODO: show join and leave information and compute the list of users in the lobby
// Display LOGIC
const activePage = ref<'chat' | 'game' | 'leaderboard'>('game');
const activeIndex = ref(1);
const tabs = [{key: 'leaderboard', text: 'Leaderboard'}, {key: 'game', text: 'Game'}, {key: 'chat', text: 'Chat'},]
const switchTab = (index: number) => {
  activePage.value = tabs[index].key;
  activeIndex.value = index;
};

const bp = useBreakpoints(breakpointsTailwind)
const greaterThanSm = bp.greater('sm')
/** CHATS */
const {missed: missedMsgs} = useMissedEvent(messages,
    computed(() => activePage.value === 'chat' || greaterThanSm.value))
/** LEADERBOARD */
const {missed: missedLeaderboard} = useMissedEvent(leaderboard,
    computed(() => activePage.value === 'leaderboard' || greaterThanSm.value))
</script>

<style lang="scss">
/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>