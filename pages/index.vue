<template>
    <div>
        This is Hello world
    </div>
</template>

<script setup>
import { definePageMeta } from '#imports';

definePageMeta({
    middleware: 'auth'
})
</script>