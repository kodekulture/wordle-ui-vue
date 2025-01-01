import {$api, $post} from '../composables/api';

export const authFactory = {
    login<T>(username: string, password: string) {
        return $post<T>('/login', {body:{ username, password } })
    },
    register<T>(username: string, password: string) {
        return $post<T>('/register', {body: {username, password}})
    },
    me<T>() {
        return $api<T>('/me')
    }
}