<template>
  <div class="flex h-full w-full lg:h-2/3 lg:w-1/3 flex-col justify-center items-center">
    <h1 class="flex text-2xl"> {{ title }} </h1>
    <slot />
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: {
      type: String,
      default: 'Default Title'
    }
  })
</script>
