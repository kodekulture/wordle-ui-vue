import { defineStore } from 'pinia'
import {authFactory} from '~/api/auth';
import {useLocalStorage} from "@vueuse/core";

export const useAuthStore = defineStore('useAuthStore', () => {

  // errors
  const error = emit<string>(null)

  // lazyAPIs
  const { data, error: meError, status, refresh} = useFetchApiLazy<User>('/me')
  const loading = computed(() => status.value === 'pending')

  // local storage
  const _user = useLocalStorage<string | null>('x-user', null);
  const user = computed<User | null>({
    get: () => 
      _user.value ? JSON.parse(_user.value) as User : null
    ,
    set: (value: User|null) => {
      _user.value = value ? JSON.stringify(value) : value
    },
  })

  watch(data, () => {
    user.value = data.value
  })

  // functions
  const checkAuth = async () => {
    await refresh({dedupe: 'defer'})
    if (data.value) {
      user.value = data.value 
    } else if (meError.value) {
      error.value = `error checking authenticated user ${meError.value}`
    }
  }

  const login = async (username: string, password: string): Promise<boolean> =>  {
    try {
      await authFactory.login(username, password);
      await checkAuth()
      return !!user.value
    }catch(e) {
      error.value = `error logging in\n${e}`;
    }
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      await authFactory.register(username, password);
      return true
    } catch(e) {
      error.value = 'error registering user';
      console.log(`error signing up ${e}`)
    }
    return false
  }

  const logout = async () => {
    try {
      await authFactory.logout()
    } catch(e) {
      error.value = `error logging out
${e}`;
    }
  }

  return {
    user,
    loading,
    error,
    checkAuth,
    login,
    register,
    logout,
  }
})

interface User {
  username: string
}
