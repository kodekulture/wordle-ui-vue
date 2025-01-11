<script lang="ts" setup>
import CenterBox from "~/components/CenterBox.vue";

const obj = ref({
    username: '', password: ''
})
const store = useAuthStore();

const { loading, error } = storeToRefs(store);
watch(error, () => {
  if (error.value == null) return;
  showToastError(error.value)
})

const toRegister = () => navigateTo('/register');

async function login() {
    const v = obj.value
    const success = await store.login(v.username, v.password);
    if (success) {
        navigateTo('/')
    }
}

definePageMeta({
    layout: 'auth',
})
useHead({
  title: 'Login'
})
</script>
<template>
    <CenterBox title="Login to Wordle With Friends">
        <form @submit.prevent="login">
            <div class="flex flex-col my-4 justify-center items-center">
              <div class="my-2">
                  <label for="username">Username:</label>
                  <UInput v-model="obj.username" id="username" name="username" variant="outline" />
              </div>
              <div class="mb-8">
                  <label for="password">Password:</label>
                  <UInput v-model="obj.password" id='password' type='password' name='password' />
              </div>
              <UButton type="submit" :disabled="loading" :loading="loading" @click="login" class="w-44 justify-center">Login</UButton>
        </div>
        </form>
        <UButton @click="toRegister" class="w-44 justify-center"> Register instead? </UButton>
    </CenterBox>
</template>