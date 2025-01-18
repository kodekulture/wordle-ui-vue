<template>
  <div class="flex justify-center">
    <h2 class="text-lg font-mono text-bold">Game Leaderboard</h2>
    <span class="rank ml-2" v-if="self">#{{ self.rank + 1 }}</span>
  </div>
  <ul class="list-none p-0 m-0 relative">
    <transition-group tag="ul" name="rank">
      <best-guess-bar :leaderboard="leaderboard" />
    </transition-group>
  </ul>
</template>

<script setup lang="ts">
import { useGameStore} from "~/stores/gameStore";
import { useFinishedGameStore} from "~/stores/finishedGameStore";
import { useAuthStore} from "~/stores/authStore";
import BestGuessBar from "~/components/game/leaderboard/BestGuessBar.vue";

// general
const statuses = {1: 'incorrect', 2: 'almost', 3: 'correct'}
const status = (x :number[] | null): string[] => x?.map(v => statuses[v]) ?? []

// active game
const store = useGameStore()
const { user } = storeToRefs(useAuthStore())
const { leaderboard: $ldb } = storeToRefs(store)
const self = computed(() => leaderboard.value.find(sm => sm.username === user.value.username))

// finished game
const finishedStore = useFinishedGameStore()
const { game } = storeToRefs(finishedStore)
const ended = computed<boolean>(() => game.value?.ended_at != null)

const leaderboard = computed(() => ended.value ? (game.value?.game_performance ?? []) : $ldb.value)
watch(leaderboard, () => {
  console.log(`refreshed leaderboard: ${JSON.stringify(leaderboard.value)}`)
})
</script>

<style lang="scss" scoped>
.rank {
  @apply font-black text-green-500 tracking-widest text-lg;
}

.box {
  --back-color: #676767;
  background-color: var(--back-color);
}

[data-status=almost] {
  --back-color: hsl(40, 65%, 48%);
}
[data-status=correct] {
  --back-color: hsl(120, 25%, 65%);
}
.rank-move {
  transition: transform 0.5s ease;
}
.rank-enter-active .rank-leave-active {
  transition: all 0.5s ease;
}

.rank-enter-from .rank-leave-to {
  transform: scale(0.9);
  opacity: 0.5;
}
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.rank-leave-active {
  position: absolute;
}

</style>