<template>
  <li
      class="mx-1 bg-gray-800 rounded-lg flex flex-wrap items-center"
      :class="size === 'sm' ? 'p-1 my-0.5 text-xs' : 'p-2 my-1'"
      v-for="summary in leaderboard" :key="`${summary.username}`">
    <div>
      <span class="rank">#{{ summary.rank + 1 }}</span>
      <span class="mx-2 text-white"> {{ summary.username }}</span>
      <span
          :class="size === 'md' ? 'text-sm' : 'text-xs'"
          class="font-mono text-gray-400 tracking-tight">{{ summary.words_played }} {{ size === 'md' ? pluralize('guess', summary.words_played): '' }}</span>
    </div>
    <div v-if="showBar" class="flex flex-nowrap ml-auto pl-1 mr-0">
      <div v-for="st in str(summary.best.status)"
           :class="size === 'sm' ? 'size-2' : 'size-4'"
           class="box m-0 p-0 border border-solid" :data-status="st" />
    </div>
  </li>
</template>

<script lang="ts" setup>
import {pluralize} from "~/utils";
import type {Leaderboard} from "~/api/game";
withDefaults(defineProps<{
  leaderboard: Leaderboard,
  size?: 'sm' | 'md',
  showBar?: boolean,
}>(), {size: 'md', showBar: true})
const statuses = {1: 'incorrect', 2: 'almost', 3: 'correct'}
const str = (x :number[] | null): string[] => x?.map(v => statuses[v]) ?? []
</script>

<style>

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
</style>