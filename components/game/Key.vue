<template>
  <div :style="{backgroundColor: color}"
       class='p-2 m-0.5 lg:m-1 max-h-9 border-gray-500 border rounded-md flex shrink justify-center items-center cursor-pointer'>
    {{ letter }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  letter: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: null,
  }
})

const color = computed(() => {
  switch (props.status) {
    case 1:
      return '#676767'
    case 2:
      return '#CA952B'
    case 3:
      return '#8FBC8F'
    default:
      return '#B3B3B3'
  }
})
</script>