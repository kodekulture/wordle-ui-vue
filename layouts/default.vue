<template>
  <header class="bg-white dark:bg-gray-900">
    <nav class="fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div class="w-full flex flex-wrap items-center justify-between mx-auto px-4 py-1">
        <a href="#" class="-m-1.5 p-1.5 flex flex-row">
          <img class="h-8 w-auto px-2" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Wordle With Friends</span>
        </a>
      <div>
        <div v-if="isLoggedIn" class="flex flex-row justify-end items-center">
          <div class="mx-3 dark:text-white">{{ user?.username ?? 'anonymous' }}</div>
          <UButton class="px-6 h-10" @click="logout">Logout</UButton>
        </div>
        <div v-else class="flex-1 flex flex-row items-center justify-end">
          <nuxt-link to="/login"><Button>Login</Button></nuxt-link>
          <nuxt-link to="/register"><Button>Register</Button></nuxt-link>
        </div>
      </div>
    </div>
    </nav>
  </header>
  <div class="mt-20">
  <slot />
</div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/authStore';
import { navigateTo } from '#imports';

  const store = useAuthStore();
  const {user, isLoggedIn} = storeToRefs(store);
  const logout = () => {
    store.reset()
    navigateTo('/login')
  }
</script>

<style>

</style>