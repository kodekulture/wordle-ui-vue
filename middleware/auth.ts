import { useAuthStore } from "~/stores/authStore"
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware( async (to) => {
    const authStore = useAuthStore();
    const {user} = storeToRefs(authStore);
    if (user.value) {
        return true
    }
    await authStore.checkAuth();
    if (user.value) {
        return true
    }
    if (tryUseNuxtApp()) {
        return navigateTo('/login')
    }
})
