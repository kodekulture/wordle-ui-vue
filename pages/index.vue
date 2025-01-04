<template>
    <div class="p-2 flex flex-wrap">
        <IconButton link="/game" text="Games" />
        <!-- <IconButton link="#" text="Settings" />
        <IconButton link="#" />
        -->
    </div>
</template>

<script setup>
import { definePageMeta } from '#imports';
definePageMeta({
    middleware: 'auth'
})
</script>