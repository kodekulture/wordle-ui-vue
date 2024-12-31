<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import {ref, navigateTo} from '#imports';
import { useAuthStore } from '~/stores/authStore';
const obj = ref({
    username: '', password: ''
})
const store = useAuthStore();
const {loading, isLoggedIn, error} = storeToRefs(store);
async function register() {
    const v = obj.value
    await store.register(v.username, v.password);
    if (isLoggedIn) {
        navigateTo('/')
    }
}
const toLogin = () => navigateTo('/login')
</script>
<template>
    <div class="w-full h-full flex justify-center items-center">
    <div class="content-center">
        <h1> Register in Wordle With Friends </h1>
        <form @submit.prevent="register">
            <div class="w-50 center">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" v-model="obj.username">
            </div>
            <div class="p-2">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" v-model = 'obj.password'>
            </div>
            <div>
                <Button type="submit" :disabled="loading">Register</Button>
            </div>
        </form>
        <Button @click="toLogin"> Login instead? </Button>
    </div>
</div>
</template>

<style scoped>
h1 {
    @apply text-2xl
}

input {
    @apply p-2 m-2 rounded-md border border-black
}
</style>