<template>
  <div class="p-2 mt-2 flex flex-col">
    <div class="flex justify-center w-full text-center p-4">
      <h2 class="text-lg font-semibold">Chats</h2>
    </div>
    <div class="flex-1 grow overflow-y-auto p-4">
      <div v-for="(ch, index) in messages" :key="index" class="mb-2">
        <span class="m-2">{{ch.from}}</span>
        <span>{{ch.data}}</span>
      </div>
    </div>
    <div class="flex flex-wrap bottom-0">
    <UInput v-model="message" class="flex grow mr-2" />
    <UButton @click="sendMsg" :disabled="message.length === 0"><UIcon name="tabler:send-2"></UIcon></UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useGameStore()
const { messages } = storeToRefs(store)
const message = ref('')

function sendMsg() {
  if (message.value === '') {
    return;
  }
  store.message(message.value)
  message.value = ''
}
</script>