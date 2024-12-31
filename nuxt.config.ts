import { defineNuxtConfig } from 'nuxt/config';
import {resolve} from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  alias: {
    "@": resolve(__dirname, '/'),
  },
  modules: ["@pinia/nuxt", "@vueuse/nuxt"],
  css: ['~/assets/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
})