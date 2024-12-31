<template>
  <header class="bg-white dark:bg-gray-900">
    <nav class="mx-auto flex max-w-7xl items-center justify-between lg:px-8">
      <div class="flex-1">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">Your Company</span>
          <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="" />
        </a>
      </div>
      <div>
        <div v-if="isLoggedIn" class="flex flex-row justify-end items-center">
          <div class="mx-3 dark:text-white">{{ user?.username ?? 'anonymous' }}</div>
          <Button @click="logout">Logout</Button>
        </div>
        <div v-else class="flex-1 flex flex-row items-center justify-end">
          <nuxt-link to="/login"><Button>Login</Button></nuxt-link>
          <nuxt-link to="/register"><Button>Register</Button></nuxt-link>
        </div>
      </div>
    </nav>
  </header>
  <slot />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/authStore';

  const store = useAuthStore();
  const {user, isLoggedIn} = storeToRefs(store);
  const logout = () => {
    store.reset()
    navigateTo('/login')
  }
</script>

<style>

</style>