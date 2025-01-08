<template>
  <div class="p-2 mt-2 flex flex-col">
    <div class="flex justify-center w-full text-center p-4">
      <h2 class="text-lg font-semibold">Chats</h2>
    </div>
    <div class="flex-1 grow overflow-y-auto flex flex-col w-full">
      <div v-for="(ch, index) in messages" :key="index"
           class="mb-2 flex items-center w-full"
           :class="isMe(ch.from) ? 'justify-end' : 'justify-start'"
      >
        <div class="max-w-[90%] flex">
          <span class="m-2 text-primary-500" :class="isMe(ch.from) ? 'order-last' : ''">{{ch.from}}</span>
          <span class="my-2">{{ch.data}}</span>
        </div>
      </div>
    </div>
    <div class="flex w-full flex-nowrap bottom-0">
    <UInput v-model="message" @keyup.enter="sendMsg" class="flex grow mr-2" />
    <UButton @click="sendMsg" :disabled="message.length === 0">
      <UIcon name="tabler:send-2" />
    </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const {user} = storeToRefs(useAuthStore())
const isMe = (username) => { return user.value.username === username }
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