import { defineNuxtRouteMiddleware, navigateTo } from "#build/imports";
import { useAuthStore } from "../stores/authStore"
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()
    const {isLoggedIn} = storeToRefs(authStore);
    if (isLoggedIn.value) {
        console.log('[middleware] isLoggedIn from store')
        return true;
    }
    await authStore.checkAuth();
    if (isLoggedIn.value) {
        console.log('[middleware] isLoggedIn after checking auth')
        return true;
    }
    return navigateTo('/login', {redirectCode: 301});
})
