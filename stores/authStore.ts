import {defineStore} from 'pinia'
import {authFactory} from '~/api/auth';
import {useLocalStorage} from "@vueuse/core";

export const useAuthStore = defineStore('useAuthStore', () => {
    const error = emit<string>(null)
    const {data, error: meError, status, refresh, clear } = useFetchApi<User>('/me', {immediate: false})
    const me_loading = computed(() => status.value === 'pending')
    const auth_loading = ref(false) // for login, register and logout

    const storedUser = useLocalStorage<User | null>('x-user', null, {
        serializer: {
            read: (raw) => raw ? JSON.parse(raw) : null,
            write: (obj) => JSON.stringify(obj),
        }
    });

    const user = computed(() => {
        if(import.meta.client) {
            return storedUser.value
        }
        return data.value
    })

    if (import.meta.client) {
        storedUser.value = data.value
        watch(data, () => {
            storedUser.value = data.value
        }, {})
    }

    // functions
    const checkAuth = async () => {
        await refresh({dedupe: 'cancel'})
        if (meError.value) {
            error.value = `error checking authenticated user ${meError.value}`
        }
    }

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            auth_loading.value = true
            await authFactory.login(username, password);
            await checkAuth()
            return data.value != null
        } catch (e) {
            error.value = `error logging in\n${e}`;
        } finally {
            auth_loading.value = false
        }
    }

    const register = async (username: string, password: string): Promise<boolean> => {
        try {
            auth_loading.value = true
            await authFactory.register(username, password);
            return true
        } catch (e) {
            error.value = 'error registering user';
            console.log(`error signing up ${e}`)
        } finally {
            auth_loading.value = false
        }
        return false
    }

    const logout = async () => {
        try {
            auth_loading.value = true
            await authFactory.logout()
            storedUser.value = null;
            clear();
        } catch (e) {
            error.value = `error logging out ${e}`;
        } finally {
            auth_loading.value = false
        }
    }

    return {
        user,
        me_loading,
        auth_loading,
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
