<script lang="ts" setup>
import { ref, navigateTo, storeToRefs, useAuthStore } from '#imports';
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
</script>
<template>
    <div>
        <h1> Login to Wordle With Friends </h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" v-model="obj.username">
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" v-model='obj.password'>
            </div>
            <Button :loading="loading" @click="login">Login</Button>
        </form>
        <Button @click="toRegister"> Register instead? </Button>
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