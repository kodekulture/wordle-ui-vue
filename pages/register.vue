<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, navigateTo, definePageMeta } from '#imports';
import { useAuthStore, showToastError } from '#imports';
const obj = ref({
    username: '', password: ''
})
const store = useAuthStore();
const { loading, isLoggedIn, error } = storeToRefs(store);
async function register() {
    const v = obj.value
    await store.register(v.username, v.password);
    if (isLoggedIn.value) {
        navigateTo('/')
    }
    if (error.value) {
        showToastError(error.value)
    }
}
const toLogin = () => navigateTo('/login')

definePageMeta({
    layout: 'auth'
})

</script>
<template>
    <div class="small-box">
        <h1 class="flex"> Register in Wordle With Friends </h1>
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
    </div>
</template>

<style>
h1 {
    @apply text-2xl;
}
.small-box {
    @apply flex h-full w-full lg:h-2/3 lg:w-1/3 border-solid border-2 flex-col justify-center items-center;
}
</style>