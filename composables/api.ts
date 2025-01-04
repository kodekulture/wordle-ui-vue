import { useAuthStore } from "~/stores/authStore"
import {storeToRefs} from 'pinia'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { useRuntimeConfig } from "#app"

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
  const config = useRuntimeConfig()
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
    baseURL: config.public.baseURL,
    ...opts,
    headers,
    onRequest({ request, options }) {
      console.log('request', request, options)
    },
    onResponseError({ response, error }) {
      if (response.status === 401) {
        auth.resetToken()
      }
      console.error(`response: ${JSON.stringify(response)}, error: ${error}`)
    }
  })
}

export function $post<
DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
    >(
  request: R,
  opts?: O,
) {
  return $api<T>(request, { ...opts, method: 'POST' })
}