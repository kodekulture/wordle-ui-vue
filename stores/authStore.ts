import {defineStore} from 'pinia'
import {authFactory} from '~/api/auth';
import {useLocalStorage} from "@vueuse/core";

export const useAuthStore = defineStore('useAuthStore', () => {
    const error = emit<string>(null)
    const {data, error: meError, status, refresh} = useFetchApi<User>('/me', {immediate: false})
    const loading = computed(() => status.value === 'pending')
    const user = useLocalStorage<User | null>('x-user', null, {
        serializer: {
            read: (raw) => raw ? JSON.parse(raw) : null,
            write: (obj) => JSON.stringify(obj),
        }
    });

    watch(data, () => {
        user.value = data.value
    })

    // functions
    const checkAuth = async () => {
        await refresh({dedupe: 'defer'})
        if (meError.value) {
            error.value = `error checking authenticated user ${meError.value}`
        }
    }

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            await authFactory.login(username, password);
            await checkAuth()
            return !!user.value
        } catch (e) {
            error.value = `error logging in\n${e}`;
        }
    }

    const register = async (username: string, password: string): Promise<boolean> => {
        try {
            await authFactory.register(username, password);
            return true
        } catch (e) {
            error.value = 'error registering user';
            console.log(`error signing up ${e}`)
        }
        return false
    }

    const logout = async () => {
        try {
            await authFactory.logout()
        } catch (e) {
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
