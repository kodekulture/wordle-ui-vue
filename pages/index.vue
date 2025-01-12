<template>
    <div class="p-2 flex w-full h-full items-center justify-center flex-wrap">
        <IconButton link="/game" text="Games" />
        <!-- <IconButton link="#" text="Settings" />
        <IconButton link="#" />
        -->
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
</script>