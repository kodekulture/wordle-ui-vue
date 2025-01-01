import { defineStore } from 'pinia'
import {authFactory} from '~/api/auth';
import {computed, ref, useLocalStorage } from '#imports'

export const useAuthStore = defineStore('useAuthStore', () => {
  const token = useLocalStorage<string | null>('x-token', null);
  const _user = useLocalStorage<string | null>('x-user', null);
  const user = computed<User | null>({
    get: () => 
      _user.value ? JSON.parse(_user.value) as User : null
    ,
    set: (value: User|null) => {
      _user.value = value ? JSON.stringify(value) : value
    },
  })
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const bearer = computed(() => token.value ? `Bearer ${token.value}` : null)


  const checkAuth = async () => {
    try {
      const res = await authFactory.me<User>();
      if (res.username) {
        user.value = {username: res.username}
      }
    }catch(e) {
      error.value = 'error checking authenticated user';
      console.log('error fetching current user');
    }
  }

  const resetToken = () => {
    token.value = null;
  }

  const reset = () => {
    resetToken()
    user.value = null;
  }

  const login = async (username: string, password: string) => {
    try {
      const res: {access_token: string} = await authFactory.login(username, password);
      token.value = res.access_token;
      await checkAuth()
    }catch(e) {
      error.value = 'error logging in';
      console.log('error logging in', e);
    }
  }

  const register = async(username: string, password: string) => {
    try {
      const res: {access_token: string} = await authFactory.register(username, password);
      token.value = res.access_token;
    } catch(e) {
      error.value = 'error registering user';
      console.log(`error signing up ${e}`)
    }
  }

  return {
    bearer,
    user,
    isLoggedIn,
    loading,
    error,
    checkAuth,
    login,
    register,
    resetToken,
    reset,
  }
})

interface User {
  username: string
}
