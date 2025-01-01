<template>
    <div>
        <UButton @click="console.log(config.public.baseURL)">Test Create Room</UButton>
        <UButton>Test Join Room</UButton>
        <UButton></UButton>
    <div>
        This is Hello world
    </div>
</div>
</template>

<script setup>
import { definePageMeta } from '#imports';
const config = useRuntimeConfig();
definePageMeta({
    middleware: 'auth'
})
</script>