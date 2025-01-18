<template>
  <header class="bg-white dark:bg-gray-900">
    <nav class="fixed w-full flex flex-nowrap bg-white dark:bg-gray-900 z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 p-1">
      <div class="flex flex-nowrap flex-1 items-center justify-between mx-auto px-1 md:px-4 py-1">
        <NuxtLink to="/" class="-m-1.5 p-1.5 flex flex-row">
          <img class="h-8 w-auto px-2" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          <span class="self-center text-lg lg:text-2xl font-semibold whitespace-nowrap dark:text-white">Wordle With Friends</span>
        </NuxtLink>
      <div class="flex min-w-0">
        <div v-if="user" class="flex flex-row justify-end items-center">
          <div class="mx-3 shrink dark:text-white overflow-ellipsis">{{ user?.username ?? 'anonymous' }}</div>
          <UButton class="px-1 h-auto md:px-6 md:h-10" @click="logout">Logout</UButton>
        </div>
        <div v-else class="flex-1 flex flex-row items-center justify-end">
          <nuxt-link to="/login"><UButton>Login</UButton></nuxt-link>
          <nuxt-link to="/register"><UButton>Register</UButton></nuxt-link>
        </div>
      </div>
    </div>
    </nav>
  </header>
  <div class="pt-[52px] h-screen">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/authStore';

  const store = useAuthStore();
  const {user} = storeToRefs(store);
  const logout = async () => {
    await store.logout()
    navigateTo('/login')
  }
</script>

<style>

</style>