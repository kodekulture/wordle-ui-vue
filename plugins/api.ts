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
                if (event == null) {
                    console.error(`${tag} event is somehow null in server side`)
                    return;
                }
                console.log(`${tag} ${ctx.response.headers.getSetCookie()}`)
                // OPTION 1: event.node.res.setHeader('set-cookie', ctx.response.headers.getSetCookie())
                // need to check if getSetCookie() === get('set-cookie')
                // OPTION 2: appendResponseHeader(event, 'set-cookie', ctx.response.headers.getSetCookie())
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