import { useAuthStore } from "~/stores/authStore"
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    await authStore.checkAuth();
    return true
})
