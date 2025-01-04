<template>
  <div class="grid grid-cols-3 h-full gap-2">
    <div class="col-span-2">
      <game-board />
      <div :hidden="!notActive">
        <div class="p-4">
          <div v-if="owner">
            <span>Players are waiting for you to start the game...</span>
            <UButton @click="store.start">Start</UButton>
          </div>
          <div v-else-if="owner != null && !owner" class="bottom-0">
            <span class="mb-4">Waiting for owner to start game...</span>
            <UProgress animation="carousel" />
          </div>
        </div>
      </div>
    </div>
    <game-chat />
    </div>
  <UModal v-model="loading" :transition="false" prevent-close>
    <div class="p-4 flex flex-col items-center justify-center">
      <span class="mb-4">Loading...</span>
      <UProgress animation="carousel" />
    </div>
  </UModal>
  <UModal v-model="needRestart" :transition="false" prevent-close>
      <div class="p-4 flex flex-col justify-center">
        <span class="text-wrap mb-4">{{error}}</span>
        <UButton @click="navigateTo('/game')" class="justify-center">Exit</UButton>
      </div>
  </UModal>
</template>

<script lang="ts" setup>
import { useGameStore, definePageMeta, watch, showToastError } from '#imports'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'


const {params} = useRoute()
const store = useGameStore()
const { loading, error, active, owner } = storeToRefs(store)
const notActive = computed(() => !loading.value && !active.value)
const hasError = computed(() => (error.value?.length ?? 0) > 0)

const needRestart = computed(() => notActive.value && hasError.value)

watch(error, () => {
  if (!error.value) {
    return;
  }
  showToastError(error.value)
})

onMounted( async () => {
  const id = params?.id
  if (!id) {
    return;
  }
  await store.join(id)
  await nextTick();
})


definePageMeta({
  middleware: 'auth'
})
</script>