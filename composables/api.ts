import { useAuthStore } from "~/stores/authStore"
import {storeToRefs} from 'pinia'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export function $api<
DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
    >(
  url: R,
  opts?: O,
) {
  const auth = useAuthStore()
  const { bearer } = storeToRefs(auth)
  
  let headers = {
    ...opts?.headers,
  }
  if (bearer.value) {
    headers = {
      Authorization: bearer.value,
      ...headers,
    }
  }
  
  return $fetch<T>(url, {
    baseURL: 'http://localhost:9000',
    ...opts,
    headers,
    onRequest({ request, options }) {
      console.log('request', request, options)
    },
    onResponseError({ response, error }) {
      if (response.status === 401) {
        auth.resetToken()
      }
      console.error(`response: ${response}, error: ${error}`)
    }
  })
}

export function $post<T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: Parameters<typeof $fetch<T>>[1],
) {
  return $api<T>(request, { ...opts, method: 'POST' })
}