export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
        credentials: 'include',
        baseURL: config.public.baseURL,
        onRequest: (ctx) => {
            if (import.meta.server) {
                ctx.options.headers = {...ctx.options.headers, ...useRequestHeaders(['cookie']),}
            }
        },
        onResponseError({response}) {
            if (response.status === 401) {
                console.log('[customAPI] unauthenticated')
                if (tryUseNuxtApp()) {
                    console.log('[customAPI] context is active, navigating to login')
                    navigateTo('/login')
                } else {
                    console.log('not a NUXT app here, cannot redirect to login')
                }
            }
        },
    })


    return {
        provide: {
            api,
        }
    }
})