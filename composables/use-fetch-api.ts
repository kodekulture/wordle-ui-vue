import {NitroFetchOptions, NitroFetchRequest} from "nitropack";

export function useFetchApi<T>(url: MaybeRefOrGetter<string>,
                               options?: UseFetchOptions<T>) {
    return useFetch<T>(url, {
        ...options,
        $fetch: useNuxtApp().$api as typeof $fetch,
    })
}

export function useFetchApiLazy<T>(url: MaybeRefOrGetter<string>,
                                options?: UseFetchOptions<T>) {
    return useLazyFetch<T>(url, {
        ...options,
        $fetch: useNuxtApp().$api as typeof $fetch,
    })
}

// fetchWithCookie is unused for now because I want to finish building with CSR
export const fetchWithCookie = async (url: string, cookieName: string) => {
    const api: typeof $fetch = useNuxtApp().$api
    const cookie = useCookie(cookieName);
    const response = await api.raw(url);
    if (import.meta.server) {
        const cookies = Object.fromEntries(
            response.headers
                .get("set-cookie")
                ?.split(",")
                .map((a) => a.split("="))
        );
        if (cookieName in cookies) {
            cookie.value = cookies[cookieName];
        }
    }
    return response._data;
}

/**
 * \$api replaces $fetch and contains opts with configs
 * @param request
 * @param opts
 */
export function $api<T>(request: NitroFetchRequest, opts?: NitroFetchOptions<T>) {
    const { $api } = useNuxtApp()
    if (!$api) {
        console.error('why is API null???')
    }

    return $api(request, opts) as typeof $fetch<T>
}