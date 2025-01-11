<template>
   <NuxtLink :to="link">
        <div class="p-5 m-5 border rounded-xl max-lg flex flex-col align-items justify-center">
            <div class="flex justify-center">
                <Icon :name="icon" size="50px" />
            </div>
            <div>{{ text }}</div>
        </div>
   </NuxtLink>
</template>

<script lang="ts" setup>
defineProps({
  link: {
    default: '#',
    type: String,
  },
  text: {
    default: 'Click Me',
  },
  icon: {
    default: 'tabler:device-gamepad-2',
  }
})
</script>