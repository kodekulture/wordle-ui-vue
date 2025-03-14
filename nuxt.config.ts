import {defineNuxtConfig} from 'nuxt/config';
import {resolve} from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {
        enabled: false,
        timeline: {
            enabled: false,
        },
    },
    runtimeConfig: {
        public: {
            baseURL: 'http://localhost:9000'
        },
    },
    css: ['~/assets/main.scss'],
    alias: {
        "@": resolve(__dirname, '/'),
    },
    modules: ["@pinia/nuxt", "@vueuse/nuxt", '@nuxt/ui', "@nuxtjs/tailwindcss"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    // ui: {
    //   safelistColors: ['black'],
    // },
    ssr: true,
})