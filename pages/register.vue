<template>
  <CenterBox title="Register in Wordle With Friends">
    <form @submit.prevent="register">
      <div class="flex flex-col my-4 justify-center items-center">
      <div class="my-2">
          <label for="username">Username:</label>
          <UInput type="text" id="username" name="username" v-model="obj.username" />
      </div>
      <div class="mb-8">
          <label for="password">Password:</label>
          <UInput type="password" id="password" name="password" v-model='obj.password' />
      </div>
      <UButton type="submit" :disabled="loading" class="w-44 justify-center">Register</UButton>
      </div>
    </form>
    <UButton @click="toLogin" class="w-44 justify-center">Login instead?</UButton>
  </CenterBox>
</template>

<script lang="ts" setup>
import CenterBox from "~/components/CenterBox.vue";

const obj = ref({
  username: '', password: ''
})
const store = useAuthStore();

const { loading, error } = storeToRefs(store);
watch(error, () => {
  if (error.value) {
    showToastError(error.value)
  }
})

async function register() {
  const v = obj.value
  const result = await store.register(v.username, v.password);
  if (result) {
    navigateTo('/')
  }
}
const toLogin = () => navigateTo('/login')

definePageMeta({
  layout: 'auth'
})
useHead({
  title: 'Register'
})

</script>