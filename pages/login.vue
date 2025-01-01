<script lang="ts" setup>
import { ref, navigateTo, storeToRefs, useAuthStore, definePageMeta } from '#imports';
import Button from '~/components/Button.vue';

const obj = ref({
    username: '', password: ''
})
const store = useAuthStore();
const { loading, isLoggedIn } = storeToRefs(store);
const toRegister = () => navigateTo('/register');
async function login() {
    const v = obj.value
    await store.login(v.username, v.password);
    if (isLoggedIn.value) {
        navigateTo('/')
    }
}

definePageMeta({
    layout: 'auth',
})
</script>
<template>
    <div class="small-box">
        <h1> Login to Wordle With Friends </h1>
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
            <UButton :loading="loading" @click="login" class="w-44 justify-center">Login</UButton>
        </div>
        </form>
        <UButton @click="toRegister" class="w-44 justify-center"> Register instead? </UButton>
    </div>
</template>

<style scoped>
h1 {
    @apply text-2xl
}
</style>