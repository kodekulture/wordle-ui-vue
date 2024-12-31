import {$api, $post} from '../composables/api';

export const authFactory = {
    login<T>(username: string, password: string) {
        return $post<T>('/login', {method: 'POST', body:{ username, password } })
    },
    register<T>(username: string, password: string) {
        return $post<T>('/register', {method: 'POST', body: {username, password}})
    },
    me<T>() {
        return $api<T>('/me')
    }
}