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
        onResponse: ( ctx) => {
            let tag = '[CLIENT RESPONSE]'
            if(import.meta.server) {
                tag = '[SERVER RESPONSE]'
                const event = useRequestEvent()
            }
            console.log(`${tag} printing headers`)
            for (const v of ctx.response.headers.entries()) {
                console.log(v[0], v[1])
            }
            console.log(`${tag} stopped printing headers`)
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