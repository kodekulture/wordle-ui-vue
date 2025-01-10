import {defineStore} from 'pinia'
import {authFactory} from '~/api/auth';
import {useLocalStorage} from "@vueuse/core";

export const useAuthStore = defineStore('useAuthStore', () => {
    const error = emit<string>(null)
    const {data, error: meError, status, refresh, clear } = useFetchApi<User>('/me', {immediate: false})
    const loading = computed(() => status.value === 'pending')
    // const storedUser = useLocalStorage<User | null>('x-user', null, {
    //     serializer: {
    //         read: (raw) => raw ? JSON.parse(raw) : null,
    //         write: (obj) => JSON.stringify(obj),
    //     }
    // });

    const user = computed(() => data.value)

    // if (import.meta.client) {
    //     watch(data, () => {
    //         storedUser.value = data.value
    //     })
    // }

    // functions
    const checkAuth = async () => {
        await refresh({dedupe: 'defer'})
        if (meError.value) {
            error.value = `error checking authenticated user ${meError.value}`
        }
        console.log(`error?: ${error.value}`)
        // console.log(`user?: ${JSON.stringify(storedUser.value)}}`)
        console.log(`data?: ${JSON.stringify(data.value)}`)
    }

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            await authFactory.login(username, password);
            await checkAuth()
            // return !!storedUser.value
            return data.value != null
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
        // storedUser.value = null;
        clear();
        try {
            await authFactory.logout()
        } catch (e) {
            error.value = `error logging out
${e}`;
        }
    }

    return {
        user,
        // data,
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
