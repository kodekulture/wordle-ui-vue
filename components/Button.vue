<template>
  <button :type="type" :disabled="disabled || loading" :class="className" @click="$emit('click')">
    <slot />
    <div v-if="loading">
      <span>Loading...</span>
    </div>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type?: 'button' |'submit' | 'reset' | undefined,
  loading?: boolean,
  disabled?: boolean,
  className?: string
}>();
const type = props.type || 'button'
const className = `h-10 px-6 m-2 font-semibold rounded-md bg-black text-white ${props.className || ''}` 
</script>

<style></style>