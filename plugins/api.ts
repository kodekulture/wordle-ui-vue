export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
        credentials: 'include',
        baseURL: config.public.baseURL,
        // onRequest: (ctx) => {
        //     const event = useRequestEvent()
        //     if(event) {
        //         ctx.options.headers = useRequestHeaders(['cookie', 'set-cookie'])
        //         console.log(ctx.options.headers)
        //     }
        // },
        // onResponse: (ctx) => {
        //     const event = useRequestEvent()
        //     if (import.meta.server) {
        //         const cookieHeader = ctx.response.headers.get('set-cookie')
        //         const arr = ctx.response.headers.getSetCookie()
        //         const headers = useRequestHeaders(['set-cookie'])
        //         console.log(`cookie response header is ${cookieHeader ?? '<empty>'} but array is ${arr}, set-cookies: ${headers}`)
        //     }
        //     if (import.meta.server && event) {
        //
        //         // [server side] proxy cookies to client
        //         console.log('[customAPI] proxying cookies to client')
        //         // Forward response cookies to the client
        //         appendResponseHeader(event, 'set-cookie', cookieHeader)
        //     }
        // },
        onResponseError({response}) {
            if (response.status === 401) {
                console.log('[customAPI] unauthenticated')
                if (tryUseNuxtApp()) {
                    console.log('[customAPI] context is active, navigating to login')
                    navigateTo('/login')
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