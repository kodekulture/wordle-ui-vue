export const authFactory = {
    login<T>(username: string, password: string) {
        return $api<T>('/login', {body:{ username, password }, method: 'POST' })
    },
    register<T>(username: string, password: string) {
        return $api<T>('/register', {body: {username, password}, method: 'POST'})
    },
    logout<T>() {
        return $api<T>('/logout', {method: 'POST'})
    }
}