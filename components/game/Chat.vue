<template>
  <div class="p-2 h-full mt-2 flex flex-col">
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
    <div class="relative w-full flex-nowrap">
      <div class="flex flex-col w-full bottom-0">
        <div v-if="showReconnect" class="w-full items-center flex flex-nowrap px-2 gap-2">
        <span class="flex-1 inline-flex">
          You're currently disconnected. Please reconnect to continue playing.
        </span>
        <UButton class="flex" :disabled="connecting" :loading="connecting" @click="store.reconnect">
          <span v-if="connecting">
            Reconnecting...
          </span>
          <span v-else>
            Reconnect
          </span>
        </UButton>
        <NuxtLink to="/game">
        <UButton class="flex" color="red">Leave</UButton>
        </NuxtLink>
      </div>
        <div class="flex w-full px-2 py-1 space-x-2">
          <UInput v-model="message" @keyup.enter="sendMsg" class="flex-grow" />
          <UButton @click="sendMsg" :disabled="message.length === 0" class="flex-none">
            <UIcon name="tabler:send-2" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {user} = storeToRefs(useAuthStore())
const isMe = (username) => { return user.value.username === username }
const store = useGameStore()
const { messages, status } = storeToRefs(store) // TODO: show UI to trigger reconnection if status is CLOSED
const showReconnect = computed(() => status.value !== 'OPEN')
const connecting = computed(() => status.value === 'CONNECTING')

const message = ref('')

function sendMsg() {
  if (message.value === '') {
    return;
  }
  store.message(message.value)
  message.value = ''
}
</script>