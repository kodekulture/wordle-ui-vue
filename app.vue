<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import {useHead} from "#imports";

const title = 'Wordle with Friends - Realtime multiplayer wordle game'
const description = 'Wordle with Friends is a simple interactive real-time wordle game, with leaderboards, chat and lots more.'

useHead({
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} | ${title}` : `${title}`
  },
  meta: [
    {name: 'title', content: title},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'twitter:title', content: title},
    {property: 'twitter:description', content: description},
    {name: 'author', content: 'Evans Owamoyo <evans.dev99@gmail.com>, Ahmed Helali'},
    {property:'og:type', content:'website'},
  ],
})
</script>